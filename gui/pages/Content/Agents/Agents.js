import React from 'react';
import Image from "next/image";
import styles from './Agents.module.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Agents({sendAgentData, agents}) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title_box}>
          <p className={styles.title_text}>Agents</p>
        </div>
        <div className={styles.wrapper} style={{marginBottom:'10px',marginTop:'4px'}}>
          <button style={{width:'100%'}} className={styles.agent_button} onClick={() => sendAgentData({ id: -1, name: "new agent", contentType: "Create_Agent" })}>
            + Create Agent
          </button>
        </div>
        {agents && agents.length > 0 ? <div className={styles.wrapper}>
          {agents.map((agent, index) => (
            <div key={index}>
              <div className={styles.agent_box} onClick={() => sendAgentData(agent)}>
                {agent.status && <div className={styles.agent_active}><Image width={8} height={8} src="/images/active_icon.png" alt="active-icon"/></div>}
                <div className={styles.text_block}><span className={styles.agent_text}>{agent.name}</span></div>
              </div>
            </div>
          ))}
        </div> : <div style={{
          marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} className="form_label">
          No Agents found
        </div>}
      </div>
    <ToastContainer/>
  </>
  );
}
