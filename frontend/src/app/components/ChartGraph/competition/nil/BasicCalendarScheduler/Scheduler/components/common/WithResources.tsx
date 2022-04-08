import { ReactChild } from "react";
import { useAppState } from "../../hooks/useAppState";
import { DefaultRecourse } from "../../types";
import { ResourceHeader } from "./ResourceHeader";
import { ButtonTabProps, ButtonTabs } from "./Tabs";

interface WithResourcesProps {
  renderChildren(resource: DefaultRecourse): ReactChild;
}
const WithResources = ({ renderChildren }: WithResourcesProps) => {
  const { resourceViewMode } = useAppState();

  if (resourceViewMode === "tabs") {
    return <ResourcesTabTables renderChildren={renderChildren} />;
  } else {
    return <ResourcesTables renderChildren={renderChildren} />;
  }
};

const ResourcesTables = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields } = useAppState();

  return (
    <>
      {resources.map((res: DefaultRecourse, i: number) => (
        <div key={`${res[resourceFields.idField]}_${i}`}>
          <ResourceHeader resource={res} />
          {renderChildren(res)}
        </div>
      ))}
    </>
  );
};

const ResourcesTabTables = ({ renderChildren }: WithResourcesProps) => {
  const { resources, resourceFields, selectedResource, handleState } =
    useAppState();

  const tabs: ButtonTabProps[] = resources.map((res) => {
    return {
      id: res[resourceFields.idField],
      label: <ResourceHeader resource={res} />,
      component: <>{renderChildren(res)}</>,
    };
  });

  const setTab = (tab: DefaultRecourse["assignee"]) => {
    handleState(tab, "selectedResource");
  };

  return (
    <ButtonTabs
      tabs={tabs}
      tab={selectedResource || resources[0][resourceFields.idField]}
      setTab={setTab}
      style={{ display: "grid" }}
    />
  );
};
WithResources.defaultProps = {
  span: 1,
};

export { WithResources };
