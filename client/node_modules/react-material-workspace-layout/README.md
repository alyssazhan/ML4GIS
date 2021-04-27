# React Material Workspace Layout

> This was hastily written, please PR with fixes :)

## Installation and Usage

`yarn add react-material-workspace-layout`

```javascript
import Workspace from "react-material-workspace-layout/Workspace" 
import SidebarBox from "react-material-workspace-layout/SidebarBox"

<Workspace
    allowFullscreen
    headerItems={[{ name: "Prev" }, { name: "Next" }, { name: "Save" }]}
    onClickHeaderItem={console.log}
    onClickIconSidebarItem={console.log}
    iconSidebarItems={[
      {
        name: "Play",
      },
      {
        name: "Pause",
      },
    ]}
    rightSidebarItems={[
      <SidebarBox icon={<FeaturedVideoIcon />} title="Region Selector">
        Hello world!
      </SidebarBox>,
    ]}
  >
    Hello World, this is the main content where an image or something might go!
  </Workspace>
```

## Props

### <Workspace />

| Prop | Description | Example | Default |
| ---- | ----------- | ------- | ------- |
|`allowFullscreen` | Enables a full screen button |  | `false` |
| `headerItems` | | | |
| `onClickHeaderItem` | | |
| `onClickIconSidebarItem` | | |
| `iconSidebarItems` | | |
| `rightSidebarItems` | | |
