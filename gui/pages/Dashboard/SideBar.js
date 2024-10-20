import React, {useState} from 'react';
import Image from 'next/image';
import styles from './Dashboard.module.css';

export default function SideBar({onSelectEvent}) {
  const [sectionSelected, setSelection] = useState('agents');

  const handleClick = (value) => {
    setSelection(value);
    onSelectEvent(value);
  };

  return (
    <div className={styles.side_bar}>
      <div><Image width={64} height={48} className={styles.logo} src="/images/app-logo-light.png" alt="super-agi-logo"/>
      </div>
      <div className={styles.selection_section}>
        <div onClick={() => handleClick(sectionSelected !== 'agents' ? 'agents' : '')} className={`${styles.section} ${sectionSelected === 'agents' ? styles.selected : ''}`}>
          <div className={styles.button_icon}><Image width={17} height={17} src="/images/agents_light.png" alt="agent-icon"/></div>
          <div>Agents</div>
        </div>
      </div>
      <div className={styles.selection_section}>
        <div onClick={() => handleClick(sectionSelected !== 'tools' ? 'tools' : '')} className={`${styles.section} ${sectionSelected === 'tools' ? styles.selected : ''}`}>
          <div className={styles.button_icon}><Image width={17} height={17} src="/images/tools_light.png" alt="tools-icon"/></div>
          <div>Tools</div>
        </div>
      </div>
      {/*<div className={styles.selection_section}>*/}
      {/*  <div onClick={() => handleClick(sectionSelected !== 'agent_cluster' ? 'agent_cluster' : '')} className={`${styles.section} ${sectionSelected === 'agent_cluster' ? styles.selected : ''}`}>*/}
      {/*    <div className={styles.button_icon}><Image width={17} height={17} src="/images/agent_cluster_light.png" alt="agent-cluster-icon"/></div>*/}
      {/*    <div>Agent Cluster</div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className={styles.selection_section}>*/}
      {/*  <div onClick={() => handleClick(sectionSelected !== 'apm' ? 'apm' : '')} className={`${styles.section} ${sectionSelected === 'apm' ? styles.selected : ''}`}>*/}
      {/*    <div className={styles.button_icon}><Image width={17} height={17} src="/images/apm_light.png" alt="apm-icon"/></div>*/}
      {/*    <div>APM</div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className={styles.selection_section}>*/}
      {/*  <div onClick={() => handleClick(sectionSelected !== 'embeddings' ? 'embeddings' : '')} className={`${styles.section} ${sectionSelected === 'embeddings' ? styles.selected : ''}`}>*/}
      {/*    <div className={styles.button_icon}><Image width={17} height={17} src="/images/embedding_light.png" alt="embedding-icon"/></div>*/}
      {/*    <div>Embeddings</div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
