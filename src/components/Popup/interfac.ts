import React, { CElement, FunctionComponent } from "react";

export interface IKeyVal {
  [key: string]: any
}

export interface IComponentProps {
  closePopup: () => void;
  closeAllPopup: () => void;
  emit: (data: IKeyVal) => void;
  forcedRefresh: () => void;
  childData: IKeyVal;

  [key: string]: any;
}

export interface IPopupItem {
  childData: IKeyVal;
  component: IComponent;
}

export type IComponent = React.FC<IComponentProps> | React.ReactElement<IComponentProps>;
