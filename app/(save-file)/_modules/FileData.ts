export interface FileData {
    id: string;
    name: string;
    size: string;
    uploadDate: string;
    type: string;
    isFolder?: boolean;
    starred?: boolean;
    shared?: boolean;
    owner?: string;
    permissions?: 'view' | 'edit' | 'owner';
    sharedWith?: string[];
    parentId?: string;
    path?: string[];
    lastModified?: string;
    version?: number;
    tags?: string[];
    description?: string;
}