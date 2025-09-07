export enum UserPageTabs {
  General = "general",
  Business = "business",
}

export enum ServicesPageTabs {
  Published = "published",
  Drafts = "drafts",
}
export const UserPageTabTiles = {
  [UserPageTabs.General]: "General",
  [UserPageTabs.Business]: "Business",
};

export const UserPageTabsQuery = {
  [UserPageTabs.General]: "general",
  [UserPageTabs.Business]: "business",
};

export const ServicesPageTabTiles = {
  [ServicesPageTabs.Published]: "Published",
  [ServicesPageTabs.Drafts]: "Drafts",
};
