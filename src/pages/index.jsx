import React, {useContext} from 'react';
import DevConfigContext from '../contexts/devConfigContext';

const Index = () => {
  const devConfig = useContext(DevConfigContext);

  // eslint-disable-next-line react/no-array-index-key
  const renderDevConfigList = (configItem) => configItem.map((item, i) => <li key={`devConfigItem${i}`}>{item}</li>);

  return (
    <div>
      <h1>React Boilerplate</h1>
      <h2>Completed Initial Features</h2>
      <h3>Front End</h3>
      <ul>
        <li>Page routing via react-router-dom</li>
        <li>Context example</li>
        <li>Base styling</li>
      </ul>
      <h3>Dev Dependency Configuration</h3>
      <ul>{renderDevConfigList.length > 0 && renderDevConfigList(devConfig)}</ul>
    </div>
  );
};

export default Index;
