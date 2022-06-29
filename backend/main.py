from concurrent.futures import thread
from lib2to3.pgen2.token import OP
import logging
from multiprocessing import Process
import multiprocessing
from pprint import PrettyPrinter
import re
import sys
import threading
import time
from requests import HTTPError, patch
import _io
import json
import shutil
from builtins import print
from typing import List, Optional
from pysnmp.entity import engine, config
from pysnmp.carrier.asyncore.dgram import udp
from pysnmp.entity.rfc3413 import ntfrcv
from easysnmp import Session, snmp_set
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from pysmi.codegen import JsonCodeGen
from pysmi.compiler import MibCompiler
from pysmi.parser import SmiV2Parser
from pysmi.reader import FileReader
from pysmi.searcher import PyFileSearcher, PyPackageSearcher, StubSearcher
from pysmi.writer import FileWriter
from fastapi.middleware.cors import CORSMiddleware

pyCompileFlag = True
pyOptimizationLevel = 0

origins = [
    "http://localhost:4200"
]
TrapAgentAddress = '127.0.0.1'
port = 1620
snmpEngine = engine.SnmpEngine()

print(snmpEngine.setUserContext())
test2 = []
session = Session(version=1)
i = 1


def getSnmpDict(jsonFile: _io.TextIOWrapper):
    return json.load(jsonFile)


def createSession(hostname: str, version: int, remote_port: int, community: str,
                  security_username: Optional[str],
                  auth_password: Optional[str], security_level: Optional[str], auth_protocol: Optional[str],
                  privacy_password: Optional[str],privacy_protocol=Optional[str]):
    if version == 2:
        return Session(hostname=hostname, community=community, version=version, remote_port=remote_port)
    else:
        return Session(hostname=hostname, community=community, version=version, remote_port=remote_port,
                       security_username=security_username, auth_password=auth_password, security_level=security_level,
                       auth_protocol=auth_protocol, privacy_password=privacy_password,privacy_protocol=privacy_protocol )


def getFunc(hostname: str, oid: str, version: int, remote_port: int, community: str, security_username: Optional[str],
            auth_password: Optional[str], security_level: Optional[str], auth_protocol: Optional[str],
            privacy_password: Optional[str],privacy_protocol=Optional[str]):
    return createSession(hostname=hostname, community=community, version=version, remote_port=remote_port,
                         security_username=security_username, auth_password=auth_password,
                         security_level=security_level,
                         auth_protocol=auth_protocol, privacy_password=privacy_password,privacy_protocol=privacy_protocol).get(oid)


# print(getFunc('192.168.1.235', oid='1.3.6.1.2.1.1.5.0', version=1))


def setFunc(hostname: str, oid: str, version: int, value: str, remote_port: int, community: str, snmp_type: str,
            security_username: Optional[str],
            auth_password: Optional[str], security_level: Optional[str], auth_protocol: Optional[str],
            privacy_password: Optional[str],privacy_protocol=Optional[str]):
    return snmp_set(oid, value, type='i', hostname=hostname, community=community, version=version,
                    remote_port=remote_port,
                    security_username=security_username, auth_password=auth_password,
                    security_level=security_level,
                    auth_protocol=auth_protocol,privacy_protocol=privacy_protocol)
    return createSession(hostname=hostname, community=community, version=version, remote_port=remote_port,
                         security_username=security_username, auth_password=auth_password,
                         security_level=security_level,
                         auth_protocol=auth_protocol, privacy_password=privacy_password,privacy_protocol=privacy_protocol).set(oid, value, snmp_type)


def walkFunc(hostname: str, oid: str, version: int, remote_port: int, community: str, security_username: Optional[str],
             auth_password: Optional[str], security_level: Optional[str], auth_protocol: Optional[str],
             privacy_password: Optional[str],privacy_protocol=Optional[str]):

    return createSession(hostname=hostname, community=community, version=version, remote_port=remote_port,
                         security_username=security_username, auth_password=auth_password,
                         security_level=security_level,
                         auth_protocol=auth_protocol, privacy_password=privacy_password,privacy_protocol=privacy_protocol).walk(oid)


def create_upload_file2(uploaded_file: UploadFile = File(...)):
    file_location = f"/usr/share/snmp/mibs/{uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(uploaded_file.file, file_object)
    return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}


def setPort(portt):
    global port
    port = portt


def dispatch():
    try:
        snmpEngine.transportDispatcher.runDispatcher()

    except:
        snmpEngine.transportDispatcher.closeDispatcher()

        raise



class socket(threading.Thread,):
    def __init(self, session:Session):
        threading.Thread.__init__(self)
    TrapAgentAddress = '127.0.0.1'  # Trap listener address

    Config = config
    
    Config.addTransport(
        snmpEngine,
        udp.domainName + (1,),
        udp.UdpTransport().openServerMode((TrapAgentAddress, port)),
    )
    if session.version == 3:
        Config.addV3User(snmpEngine=snmpEngine, userName=session.security_username, authProtocol=session.auth_protocol,
                            privProtocol=session.privacy_protocol, authKey=session.auth_password, privKey=session.privacy_password,
                            )
        pass
    else:
        Config.addV1System(snmpEngine, 'my-area', session.community)

    def cbFun(snmpEngine, stateReference, contextEngineId, contextName,
              varBinds, cbCtx):
        global i

        for name, val in varBinds:

            #print('%s = %s' % (name.prettyPrint(), val.prettyPrint()))
            test2.append(TrapModel(index=i, port=port,
                         oid=name.prettyPrint(), data=val.prettyPrint()))
            i += 1
    ntfrcv.NotificationReceiver(snmpEngine, cbFun)

    snmpEngine.transportDispatcher.jobStarted(1)


class SnmpRequest(BaseModel):
    hostname: str
    community: str
    oid: str
    version: int = 1
    remote_port: int
    security_username: Optional[str]
    auth_password: Optional[str]
    privacy_password: Optional[str]
    security_level: Optional[str]
    auth_protocol: Optional[str]
    value: Optional[str]
    snmp_type: str = 's'
    privacy_protocol:Optional[str]


class Event(BaseModel):
    length: int
    pageIndex: int
    pageSize: int
    previousPageIndex: int
    data: Optional[list]


class TrapModel(BaseModel):
    index: int
    port: int
    oid: str
    data: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/test-conn')
async def testConn(payload:dict):
    print(payload)
    request = SnmpRequest(hostname=payload['hostname'], community=payload['community'], oid=payload['oid'],
                          version=payload['version'], remote_port=payload['remote_port'],
                          security_username=payload['security_username'], auth_password=payload['auth_password'],
                          security_level=payload['security_level'], auth_protocol=payload['auth_protocol'],
                          privacy_password=payload['privacy_password'], privacy_protocol=payload['privacy_protocol'])
    global session
                                
    if request.version == 2:
        try:
            
            session = Session(hostname=request.hostname, version=2, community=request.community, remote_port=request.remote_port)
            session.get('.1.3.6.1.2.1.1.5.0')
        except:
            
            raise HTTPException(status_code=404)
    elif request.version == 3:
        try:
            
            session = Session(hostname=request.hostname, version=3, community=request.community, remote_port=request.remote_port, security_level=request.security_level,
                                security_username=request.security_username, privacy_protocol=request.privacy_protocol, privacy_password=request.privacy_password,
                                auth_protocol=request.auth_protocol, auth_password=request.auth_password )
            print(session.get('.1.3.6.1.2.1.1.5.0') )                               

        except:
            
            raise HTTPException(status_code=404)
    
    return 1                     
     
@app.post("/get-request")
async def getRequest(payload: dict):
    request = SnmpRequest(hostname=payload['hostname'], community=payload['community'], oid=payload['oid'],
                          version=payload['version'], remote_port=payload['remote_port'],
                          security_username=payload['security_username'], auth_password=payload['auth_password'],
                          security_level=payload['security_level'], auth_protocol=payload['auth_protocol'],
                          privacy_password=payload['privacy_password'],privacy_protocol=payload['privacy_protocol'])

    return getFunc(**request.dict(exclude={'value', 'snmp_type'}))


@app.post("/set-request")
async def setRequest(payload: dict):
    request = SnmpRequest(hostname=payload['hostname'], community=payload['community'], oid=payload['oid'],
                          version=payload['version'], remote_port=payload['remote_port'],
                          security_username=payload['security_username'], auth_password=payload['auth_password'],
                          security_level=payload['security_level'], auth_protocol=payload['auth_protocol'],
                          privacy_password=payload['privacy_password'],privacy_protocol=payload['privacy_protocol'])
    return setFunc(**request.dict())


@app.post("/walk-request")
async def walkRequest(payload: dict):
    print(payload)
    request = SnmpRequest(hostname=payload['hostname'], community=payload['community'], oid=payload['oid'],
                          version=payload['version'], remote_port=payload['remote_port'],
                          security_username=payload['security_username'], auth_password=payload['auth_password'],
                          security_level=payload['security_level'], auth_protocol=payload['auth_protocol'],
                          privacy_password=payload['privacy_password'],privacy_protocol=payload['privacy_protocol'])
    return walkFunc(**request.dict(exclude={'value', 'snmp_type'}))


@app.post("/upload-file/")
async def create_upload_file(file: UploadFile):
    mib = file.filename
    create_upload_file2(file)
    mibCompiler = MibCompiler(SmiV2Parser(),
                              JsonCodeGen(),
                              FileWriter('./mibs').setOptions(
                                  pyCompile=pyCompileFlag,
                                  pyOptimizationLevel=pyOptimizationLevel, suffix='.json'))
    mibCompiler.addSources(FileReader('/usr/share/snmp/mibs'))
    mibCompiler.addSearchers(PyFileSearcher('./mibs'))
    mibCompiler.addSearchers(PyPackageSearcher('pysnmp.mibs'))
    mibCompiler.addSearchers(StubSearcher(*JsonCodeGen.baseMibs))
    # return open('mibs/{}.json'.format(mib), mode='r').read()

    mibCompiler.compile(mib, ignoreErrors=True, )
    return getSnmpDict(open('mibs/{}.json'.format(mib)))


@app.get('/close-socket')
async def kill():
    sys.exit();


@app.post('/start-socket')
async def start(payload: dict):
    if session.remote_port == 0:
        print('Empty sess')
        return
    setPort(payload['trapPort'])
    if snmpEngine.transportDispatcher:
        socket()
    global x
    x = threading.Thread( target=dispatch ,daemon=True)
    x.start()
    
    x.name = 'trap'
   


    

    return


@app.post('/get-trap')
def getTrap(event: Event):
    if session.remote_port ==0:
        raise HTTPException(status_code=404)
        return
    startItem = event.pageIndex*event.pageSize
    print(test2[startItem:startItem+event.pageSize])
    print(test2)
    event.data = test2[startItem:startItem+event.pageSize]
    event.length = len(test2)

    return event


@app.post("/trap-socket")
async def trap():

    return


exampleString = ""
