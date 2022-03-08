import React, { ReactElement } from "react";

export interface IKeyVal {
  [key: string]: any
}

export interface IComponentProps {
  closePopup: () => void;
  closeAllPopup: () => void;
  emit: (data: IKeyVal) => void;
  childData: IKeyVal;

  [key: string]: any;
}

export interface IPopupItem {
  id: number;
  childData: IKeyVal;
  component: IComponent;
}

export type IComponent = React.JSXElementConstructor<any>; // (props: IComponentProps) => JSX.Element | ReactElement<any, any> ;
