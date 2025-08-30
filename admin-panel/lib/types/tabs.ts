export enum UserPageTabs {
  General = "general",
  Business = "business",
}

export enum CoursesPageTabs {
  Published = "published",
  Drafts = "drafts",
}

export enum WebinarPageTabs {
  Live="live",
  Published = "published",
  Drafts = "drafts",
}

export enum MasteryPageTabs {
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

export const CoursesPageTabTiles = {
  [CoursesPageTabs.Published]: "Published",
  [CoursesPageTabs.Drafts]: "Drafts",
};

export const WebinarPageTabTiles = {
  [WebinarPageTabs.Live]: "Live",
  [WebinarPageTabs.Published]: "Published",
  [WebinarPageTabs.Drafts]: "Drafts",
};

export const MasteryPageTabTiles = {
  [MasteryPageTabs.Published]: "Published",
  [MasteryPageTabs.Drafts]: "Drafts",
};
