package datart.server.service;

import datart.core.entity.Folder;
import datart.core.mappers.FolderMapper;
import datart.security.base.ResourceType;

import java.util.List;

public interface FolderService extends BaseCRUDService<Folder, FolderMapper> {

    List<Folder> listOrgFolders(String orgId);

    boolean checkUnique(ResourceType type, String orgId, String parentId, String name);

    Folder getVizFolder(String vizId,String relType);

    List<Folder> getAllParents(String folderId);

}