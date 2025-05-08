export const Events = {
  NewTask: 'NewTask',
  LoadTasks: 'LoadTasks',
  LoadTasksSuccess: 'LoadTasksSuccess',
  LoadTasksFailure: 'LoadTasksFailure',
  StoreTask: 'StoreTask',
  StoreTaskSuccess: 'StoreTaskSuccess',
  StoreTaskFailure: 'StoreTaskFailure',
  UnStoreTasks: 'UnStoreTasks',
  UnStoreTasksSuccess: 'UnStoreTasksSuccess',
  UnStoreTasksFailure: 'UnStoreTasksFailure',
  SwitchToMainView: 'SwitchToMainView',
  SwitchToSimpleView: 'SwitchToSimpleView',

  //for Storage Page
  //filtering storage based on tags
  StorageAddTag: 'StorageAddTag',
  StorageFilterAddTag: 'StorageFilterAddTag',
  StorageRemoveTag: 'StorageRemoveTag',
  StorageFilterRemoveTag: 'StorageFilterRemoveTag',

  //load storage listings
  LoadStorageListings: 'LoadStorageListings',
  LoadStorageSuccess: 'LoadStorageSuccess',
  LoadStorageServer: 'LoadStorageServer',
  LoadStorageServerSuccess: 'LoadStorageServerSucess',
  LoadAllListings: 'LoadAllListings',
  LoadAllListingsSuccess: 'LoadAllListingsSuccess',

  //filters for storage
  StorageCostFilter: 'StorageCostFilter',
  StorageTimeFilter: 'StorageTimeFilter',
  StorageSpaceFilter: 'StorageSpaceFilter', 

  //price filter and new button
  StoragePriceAscend: 'StoragePriceAscend',
  StoragePriceDescend: 'StoragePriceDescend',
  StorageUnfilteredList: 'StorageUnfilteredList',

  //update storage listings (called when item is being upload for sale or is being bought)
  AddStorageItem: 'AddStorageItem',
  AddStorageItemSuccess: 'AddStorageItemSucces',
  RemoveStorageItem: 'RemoveStorageItem',
  RemoveStorageItemSuccess: 'RemoveStorageItemSucess',
  UpdateStorageItem: 'UpdateStorageItem',
  UpdateStorageItemSuccess: 'UpdateStorageItemSucess',
};
