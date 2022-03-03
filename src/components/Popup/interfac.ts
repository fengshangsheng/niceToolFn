export interface IKeyVal {
  [key: string]: any
}

export interface IComponentProps {
  closePopup: Function
  closeAllPopup: Function
  emit: (data: IKeyVal) => void
  childData: IKeyVal
}

export interface IPopupItem {
  id: number
  component: React.SFC<any>
  childData: object
}
