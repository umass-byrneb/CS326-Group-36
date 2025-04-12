export const Events = {
    NewTask: 'NewTask',

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
    RemoveStorageItem: 'RemoveStorageItem',
    
  };
  