export class Demo {
    id: number = 0;
    name: string = null;
    isActive: boolean = false;
    createDate: Date = null;
    demoItems: DemoItem[]=[];
    constructor(defaultData?: Partial<Demo>) {
        defaultData = defaultData || {};
        Object.keys(defaultData).forEach((key) => {
            const value = defaultData[key];
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        });
    }
}
export class DemoItem {
    id: number = 0;
    demoId: number = 0;
    name: string = null;
    description: string = null;
    title: string = null;
    isActive: string = null;
    demoItemFileAttachments: DemoItemFileAttachment[]=[];
    constructor(defaultData?: Partial<DemoItem>) {
        defaultData = defaultData || {};
        Object.keys(defaultData).forEach((key) => {
            const value = defaultData[key];
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        });
    }
}

export class DemoItemFileAttachment {
    id: number = 0;
    demoItemId: number = 0;
    fileName: string = null;
    folderNAme: string = null;
    isActive: boolean = false;
    constructor(defaultData?: Partial<DemoItemFileAttachment>) {
        defaultData = defaultData || {};
        Object.keys(defaultData).forEach((key) => {
            const value = defaultData[key];
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        });
    }
}
