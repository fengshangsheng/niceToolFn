export interface IKeyVal {
  [key: string]: any
}

export interface IComponentProps {
  closePopup: Function
  closeAllPopup: Function
  emit: (data: IKeyVal) => void
  childData: IKeyVal

  [key: string]: any
}

export interface IPopupItem {
  id: number
  component: IPopupComponent
  childData: object
}

export interface IPopupComponent {
  (props: IComponentProps): JSX.Element;

  // <IComponentProps>(
  //   element: ReactElement<IComponentProps>
  // ): Component<IComponentProps> | Element | void;
}
