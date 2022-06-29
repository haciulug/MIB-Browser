import {
  Component
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import {
  FlatTreeControl
} from '@angular/cdk/tree';
import {
  ApiService
} from '../service/api.service';
import {
  GlobalService
} from '../service/global.service'
import {
  MatDialog
} from '@angular/material/dialog';
import {
  Box2Component
} from '../box2/box2.component'
import {
  SettingWindowComponent
} from '../dialog/setting-window/setting-window.component'
import {
  InfoWindowComponent
} from '../dialog/info-window/info-window.component';



 
interface ExMIB {
  name: string;
  class?: string;
  oid?: string;
  child?: any[];
  level?: number;

}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;



}

@Component({
  selector: 'app-box1',
  templateUrl: './box1.component.html',
  styleUrls: ['./box1.component.css']
})

export class Box1Component {

  httpRes: any | undefined;
  mib!: File;
  searchClicked = false;
  searchString: any;
  
  



  saveFile() {
    this.httpRes = Box2Component.httpRes;
    

    let filename = 'output';
    const file = new Blob([this.httpRes], {
      type: "application/json"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    link.remove();

  }

  InfoDialog() {
    this.dialog.open(InfoWindowComponent);

    
  }
  SettingsDialog() {
    const dialogRef = this.dialog.open(SettingWindowComponent);

    dialogRef.afterClosed().subscribe(result => {
      /* console.log(`Dialog result: ${result}`); */
    });
  }
  uploadBtn(){
    document.getElementById('fileInput')?.click();
  }
  onChange(event: any) {
    this.mib = event.target.files[0];
    this.uploadMIB();
  }

  

  filterLeafNode(node: ExampleFlatNode): boolean {
    if (!this.searchString) {
      return false
    }
    return node.name.toLowerCase()
      .indexOf(this.searchString?.toLowerCase()) === -1
  }
  filterParentNode(node: ExampleFlatNode): boolean {

    if (
      !this.searchString ||
      node.name.toLowerCase()
        .indexOf(
          this.searchString?.toLowerCase()
        ) !== -1
    ) {
      return false
    }
    const descendants = this.treeControl.getDescendants(node)

    if (
      descendants.some(
        (descendantNode) =>
          descendantNode.name
            .toLowerCase()
            .indexOf(this.searchString?.toLowerCase()) !== -1
      )
    ) {
      return false
    }
    return true
  }
  

  setMIB(child: ExampleFlatNode) {
    let parent = this.getParent(child);
    for (let key in this.dataSource.data) {
      if (this.dataSource.data[key].name === parent?.name) {
        for (let key2 in this.dataSource.data[key].child) {
          if (this.dataSource.data[key].child![<any>key2].name === child.name) {
            GlobalService.oid = this.dataSource.data[key].child![<any>key2].oid;
            GlobalService.chosenMIB = this.dataSource.data[key].child![<any>key2];




          }

        }

      }




    }

  }

  private _transformer = (node: ExMIB, level: number) => {
    return {
      expandable: !!node.child && node.child.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.child,
  );
  expandParents(node: ExampleFlatNode) {
    const parent = this.getParent(node)!;
    this.expand(parent);

    if (parent && this.getLevel(parent) > 0) {
      this.expandParents(parent);
    }
  }
  expand(node: ExampleFlatNode) {
    this.treeControl.expand(node)
  }
  getLevel(node: ExampleFlatNode) {
    return node.level
  }
  getParent(node: ExampleFlatNode) {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null
  }

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private _api: ApiService, public dialog: MatDialog) {

  }



  uploadMIB() {
    this._api.uploadFile("upload-file", this.mib)
      .subscribe(res => {
        const values = Object.values(res);
        const test = {
          name: this.mib.name,
          child: values.slice(1, values.length - 1)
        };
        this.dataSource.data = [...(!!this.dataSource.data && this.dataSource.data), test]
      })
  }


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  setClick() {
    this.searchClicked = !this.searchClicked;


  }

  ngOnInit(): void {

  }
}