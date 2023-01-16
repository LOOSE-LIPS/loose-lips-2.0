import './globals';
declare const forceReRender: () => void;
export declare const setAddon: (addon: any) => void, addDecorator: (decorator: import("@storybook/addons").DecoratorFunction<unknown>) => void, addParameters: (parameters: import("@storybook/addons").Parameters) => void, clearDecorators: () => void, getStorybook: () => import("@storybook/client-api").GetStorybookKind[], raw: () => import("@storybook/client-api").PublishedStoreItem[];
export declare const storiesOf: (kind: string, m: any) => import("@storybook/addons").StoryApi<unknown>;
export declare const configure: (loadable: any, m: any) => void;
export { forceReRender };
