import { loopTree } from 'utils/utils';
import { Folder } from '../../slice/types';
import { LocalTreeDataNode } from 'app/pages/MainPage/slice/types';
import { BoardType } from 'app/pages/DashBoardPage/slice/types';

export interface SaveFormModel {
    id?: string;
    name: string;
    boardType?: BoardType;
    config?: string;
    description?: string;
    parentId?: string;
  }
  
export const setTreeIndexFn = (AddData?:SaveFormModel,treeData?:LocalTreeDataNode[]) => {
    let index:number = 0;
    if(AddData){
        if(AddData.parentId){
            loopTree(treeData,AddData.parentId, 'id',(data) =>{
              index = data.children && data.children.length > 0 ? Number(data.children[data.children.length - 1].index) + 1 : 0
            })
        }else{
            index = treeData && treeData.length > 0  ? Number(treeData[treeData.length - 1].index) + 1 : 0
        }
    }
    return index
}

