import React from "react";

export interface IKeyVal {
  [key: string]: any
}

export interface IComponentProps {
  readonly closePopup: () => void;
  readonly closeAllPopup: () => void;
  readonly emit: (data: IKeyVal) => void;
  readonly forcedRefresh: () => void;
  childData: IKeyVal;

  [key: string]: any;
}

export interface IPopupItem {
  childData: IKeyVal;
  component: IComponent;
}

export type IComponent = React.FC<IComponentProps>;
