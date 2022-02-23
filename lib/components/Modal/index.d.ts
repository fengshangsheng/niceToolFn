import React from 'react';
import { StyledComponent } from "styled-components";
interface IComponentProps {
    [key: string]: any;
}
interface IPropsOption {
    [key: string]: any;
}
export default class Modal {
    constructor(component: React.SFC<IComponentProps> | React.ReactElement<IComponentProps>, propsOption?: IPropsOption);
    content: React.SFC<IComponentProps> | React.ReactElement<IComponentProps>;
    targetContentNode?: HTMLElement;
    propsOption?: IPropsOption;
    init(): void;
    verifyParameter(): HTMLElement;
    setDomFlag(target: HTMLElement | StyledComponent<any, any>, type: string): void;
    playAnimate(isInit: boolean, callback?: Function): void;
    closeModal(): void;
    render(): void;
}
export {};
