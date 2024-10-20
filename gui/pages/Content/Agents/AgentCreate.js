import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Agents.module.css';
import { createAgent } from "@/app/DashboardService";
import { EventBus } from "@/utils/eventBus";

export default function AgentCreate({sendAgentData, selectedProjectId, fetchAgents, tools}) {
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [selfEvaluation, setSelfEvaluation] = useState('');
  const [basePrompt, setBasePrompt] = useState('');
  const [longTermMemory, setLongTermMemory] = useState(true);

  const goalsArray = ['agent goal 1']
  const [goals, setGoals] = useState(goalsArray);

  const constraintsArray = ["~4000 word limit for short term memory. Your short term memory is short, so immediately save important information to files.",
    "If you are unsure how you previously did something or want to recall past events, thinking about similar events will help you remember.",
    "No user assistance", "Ensure the command and args are as per current plan and reasoning",
    'Exclusively use the commands listed in double quotes e.g. "command name"']
  const [constraints, setConstraints] = useState(constraintsArray);

  const models = ['gpt-3.5-turbo', 'gpt-4']
  const [model, setModel] = useState(models[0]);
  const modelRef = useRef(null);
  const [modelDropdown, setModelDropdown] = useState(false);

  const agentTypes = ["Don't Maintain Task Queue"]
  const [agentType, setAgentType] = useState(agentTypes[0]);
  const agentRef = useRef(null);
  const [agentDropdown, setAgentDropdown] = useState(false);

  const exitCriteria = ["No exit criterion", "System defined", "User defined", "Number of steps/tasks"]
  const [exitCriterion, setExitCriterion] = useState(exitCriteria[0]);
  const exitRef = useRef(null);
  const [exitDropdown, setExitDropdown] = useState(false);

  const [stepTime, setStepTime] = useState(500);

  const rollingWindows = ["5", "10", "15", "20"]
  const [rollingWindow, setRollingWindow] = useState(rollingWindows[1]);
  const rollingRef = useRef(null);
  const [rollingDropdown, setRollingDropdown] = useState(false);

  const databases = ["Pinecone"]
  const [database, setDatabase] = useState(databases[0]);
  const databaseRef = useRef(null);
  const [databaseDropdown, setDatabaseDropdown] = useState(false);

  const permissions = ["God Mode"]
  const [permission, setPermission] = useState(permissions[0]);
  const permissionRef = useRef(null);
  const [permissionDropdown, setPermissionDropdown] = useState(false);

  const [myTools, setMyTools] = useState([]);
  const [toolNames, setToolNames] = useState([]);
  const toolRef = useRef(null);
  const [toolDropdown, setToolDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setModelDropdown(false)
      }

      if (agentRef.current && !agentRef.current.contains(event.target)) {
        setAgentDropdown(false)
      }

      if (exitRef.current && !exitRef.current.contains(event.target)) {
        setExitDropdown(false)
      }

      if (rollingRef.current && !rollingRef.current.contains(event.target)) {
        setRollingDropdown(false)
      }

      if (databaseRef.current && !databaseRef.current.contains(event.target)) {
        setDatabaseDropdown(false)
      }

      if (permissionRef.current && !permissionRef.current.contains(event.target)) {
        setPermissionDropdown(false)
      }

      if (toolRef.current && !toolRef.current.contains(event.target)) {
        setToolDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addTool = (tool) => {
    if (!myTools.includes(tool.id)) {
      setMyTools((prevArray) => [...prevArray, tool.id]);
      setToolNames((prevArray) => [...prevArray, tool.name]);
    }
  };
  
  const removeTool = (indexToDelete) => {
    setMyTools((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(indexToDelete, 1);
      return newArray;
    });

    setToolNames((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(indexToDelete, 1);
      return newArray;
    });
  };

  const handlePermissionSelect = (index) => {
    setPermission(permissions[index]);
    setPermissionDropdown(false);
  };

  const handleDatabaseSelect = (index) => {
    setDatabase(databases[index]);
    setDatabaseDropdown(false);
  };

  const handleWindowSelect = (index) => {
    setRollingWindow(rollingWindows[index]);
    setRollingDropdown(false);
  };

  const handleStepChange = (event) => {
    setStepTime(event.target.value)
  };

  const handleExitSelect = (index) => {
    setExitCriterion(exitCriteria[index]);
    setExitDropdown(false);
  };

  const handleAgentSelect = (index) => {
    setAgentType(agentTypes[index]);
    setAgentDropdown(false);
  };

  const handleModelSelect = (index) => {
    setModel(models[index]);
    setModelDropdown(false);
  };

  const handleGoalChange = (index, newValue) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = newValue;
    setGoals(updatedGoals);
  };

  const handleConstraintChange = (index, newValue) => {
    const updatedConstraints = [...constraints];
    updatedConstraints[index] = newValue;
    setConstraints(updatedConstraints);
  };

  const handleGoalDelete = (index) => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
  };

  const handleConstraintDelete = (index) => {
    const updatedConstraints = [...constraints];
    updatedConstraints.splice(index, 1);
    setConstraints(updatedConstraints);
  };

  const addGoal = () => {
    setGoals((prevArray) => [...prevArray, 'new goal']);
  };

  const addConstraint = () => {
    setConstraints((prevArray) => [...prevArray, 'new constraint']);
  };

  const handleNameChange = (event) => {
    setAgentName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setAgentDescription(event.target.value);
  };

  const handleSelfEvaluationChange = (event) => {
    setSelfEvaluation(event.target.value);
  };

  const handleBasePromptChange = (event) => {
    setBasePrompt(event.target.value);
  };

  const preventDefault = (e) => {
    e.stopPropagation();
  };

  const handleAddAgent = () => {
    if (agentName.replace(/\s/g, '') === '') {
      toast.dark("Agent name can't be blank", {autoClose: 1800});
      return
    }

    if (agentDescription.replace(/\s/g, '') === '') {
      toast.dark("Agent description can't be blank", {autoClose: 1800});
      return
    }

    if (goals.length <= 0) {
      toast.dark("Add atleast one goal", {autoClose: 1800});
      return
    }

    if (myTools.length <= 0) {
      toast.dark("Add atleast one tool", {autoClose: 1800});
      return
    }

    const agentData = {
      "name": agentName,
      "project_id": selectedProjectId,
      "description": agentDescription,
      "goal": goals,
      "agent_type": agentType,
      "constraints": constraints,
      "tools": myTools,
      "exit": exitCriterion,
      "iteration_interval": stepTime,
      "model": model,
      "permission_type": permission,
      "LTM_DB": database,
      "memory_window": rollingWindow
    };

    createAgent(agentData)
      .then((response) => {
        fetchAgents();
        sendAgentData({ id: response.data.id, name: response.data.name, contentType: "Agents", execution_id: response.data.execution_id })
        toast.dark('Agent created successfully', {autoClose: 1800});
      })
      .catch((error) => {
        console.error('Error creating agent:', error);
      });
  };

  return (<>
    <div>
      <div className="row" style={{padding: '10px'}}>
        <div className="col-12">
          <div>
            <div className={styles.page_title} style={{marginTop:'10px'}}>Create new agent</div>
          </div>
          <div style={{marginTop:'10px'}}>
            <div>
              <label className={styles.form_label}>Name</label>
              <input className="input_medium" type="text" value={agentName} onChange={handleNameChange}/>
            </div>
            <div style={{marginTop: '15px'}}>
              <label className={styles.form_label}>Description</label>
              <textarea className="textarea_medium" rows={3} value={agentDescription} onChange={handleDescriptionChange}/>
            </div>
            <div style={{marginTop: '15px'}}>
              <div><label className={styles.form_label}>Goals</label></div>
              {goals.map((goal, index) => (<div key={index} style={{marginBottom:'10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{flex:'1'}}><input className="input_medium" type="text" value={goal} onChange={(event) => handleGoalChange(index, event.target.value)}/></div>
                <div>
                  <button className={styles.agent_button} style={{marginLeft:'4px',padding:'5px'}} onClick={() => handleGoalDelete(index)}>
                    <Image width={20} height={21} src="/images/close_light.png" alt="close-icon"/>
                  </button>
                </div>
              </div>))}
              <div><button className={styles.agent_button} onClick={addGoal}>+ Add</button></div>
            </div>
            <div style={{marginTop: '15px'}}>
              <label className={styles.form_label}>Model</label><br/>
              <div className="dropdown_container_search" style={{width:'100%'}}>
                  <div className="custom_select_container" onClick={() => setModelDropdown(!modelDropdown)} style={{width:'100%'}}>
                    {model}<Image width={20} height={21} src={!modelDropdown ? '/images/dropdown_down.png' : '/images/dropdown_up.png'} alt="expand-icon"/>
                  </div>
                  <div>
                    {modelDropdown && <div className="custom_select_options" ref={modelRef} style={{width:'100%'}}>
                    {models.map((model, index) => (<div key={index} className="custom_select_option" onClick={() => handleModelSelect(index)} style={{padding:'12px 14px',maxWidth:'100%'}}>
                      {model}
                    </div>))}
                  </div>}
                </div>
              </div>
            </div>
            <div style={{marginTop: '15px'}}>
              <label className={styles.form_label}>Tools</label>
              <div className="dropdown_container_search" style={{width:'100%'}}>
                <div className="custom_select_container" onClick={() => setToolDropdown(!toolDropdown)} style={{width:'100%'}}>
                  {toolNames && toolNames.length > 0 ? <div style={{display:'flex',overflowX:'scroll'}}>
                    {toolNames.map((tool, index) => (<div key={index} className="tool_container" style={{marginTop:'0'}} onClick={preventDefault}>
                      <div className={styles.tool_text}>{tool}</div>
                      <div><Image width={12} height={12} src='/images/close_light.png' alt="close-icon" style={{margin:'-2px -5px 0 2px'}} onClick={() => removeTool(index)}/></div>
                    </div>))}
                  </div> : <div style={{color:'#666666'}}>Select Tools</div>}
                  <Image width={20} height={21} src={!toolDropdown ? '/images/dropdown_down.png' : '/images/dropdown_up.png'} alt="expand-icon"/>
                </div>
                <div>
                  {toolDropdown && <div className="custom_select_options" ref={toolRef} style={{width:'100%'}}>
                    {tools && tools.map((tool, index) => (<div key={index} className="custom_select_option" onClick={() => addTool(tool)} style={{padding:'12px 14px',maxWidth:'100%'}}>
                      {tool.name || 'custom tool'}
                    </div>))}
                  </div>}
                </div>
              </div>
            </div>
            <div style={{marginTop: '15px'}}>
              <button className="medium_toggle" onClick={() => setAdvancedOptions(!advancedOptions)} style={advancedOptions ? {background:'#494856'} : {}}>
                {advancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}{advancedOptions ? <Image style={{marginLeft:'10px'}} width={20} height={21} src="/images/dropdown_up.png" alt="expand-icon"/> : <Image style={{marginLeft:'10px'}} width={20} height={21} src="/images/dropdown_down.png" alt="expand-icon"/>}
              </button>
            </div>
            {advancedOptions &&
              <div>
                {/*<div style={{marginTop: '15px'}}>*/}
                {/*  <label className={styles.form_label}>Agent Type</label><br/>*/}
                {/*  <div className="dropdown_container_search" style={{width:'100%'}}>*/}
                {/*    <div className="custom_select_container" onClick={() => setAgentDropdown(!agentDropdown)} style={{width:'100%'}}>*/}
                {/*      {agentType}<Image width={20} height={21} src={!agentDropdown ? '/images/dropdown_down.png' : '/images/dropdown_up.png'} alt="expand-icon"/>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*      {agentDropdown && <div className="custom_select_options" ref={agentRef} style={{width:'100%'}}>*/}
                {/*        {agentTypes.map((agent, index) => (<div key={index} className="custom_select_option" onClick={() => handleAgentSelect(index)} style={{padding:'12px 14px',maxWidth:'100%'}}>*/}
                {/*          {agent}*/}
                {/*        </div>))}*/}
                {/*      </div>}*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                {/*<div style={{marginTop: '15px'}}>*/}
                {/*  <label className={styles.form_label}>Base prompt</label><br/>*/}
                {/*  <p className={styles.form_label} style={{fontSize:'11px'}}>This will defined the agent role definitely and reduces hallucination. This will defined the agent role definitely and reduces hallucination.</p>*/}
                {/*  <textarea className="textarea_medium" rows={3} value={basePrompt} onChange={handleBasePromptChange}/>*/}
                {/*</div>*/}
                {/*<div style={{marginTop: '15px'}}>*/}
                {/*  <label className={styles.form_label}>Self Evaluation</label><br/>*/}
                {/*  <p className={styles.form_label} style={{fontSize:'11px'}}>Allows the agent to evaluate and correct themselves as they proceed further.</p>*/}
                {/*  <textarea className="textarea_medium" rows={3} value={selfEvaluation} onChange={handleSelfEvaluationChange}/>*/}
                {/*</div>*/}
                <div style={{marginTop: '15px'}}>
                  <div><label className={styles.form_label}>Constraints</label></div>
                  {constraints.map((constraint, index) => (<div key={index} style={{marginBottom:'10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{flex:'1'}}><input className="input_medium" type="text" value={constraint} onChange={(event) => handleConstraintChange(index, event.target.value)}/></div>
                    <div>
                      <button className={styles.agent_button} style={{marginLeft:'4px',padding:'5px'}} onClick={() => handleConstraintDelete(index)}>
                        <Image width={20} height={21} src="/images/close_light.png" alt="close-icon"/>
                      </button>
                    </div>
                  </div>))}
                  <div><button className={styles.agent_button} onClick={addConstraint}>+ Add</button></div>
                </div>
                {/*<div style={{marginTop: '15px'}}>*/}
                {/*  <label className={styles.form_label}>Exit criterion</label>*/}
                {/*  <div className="dropdown_container_search" style={{width:'100%'}}>*/}
                {/*    <div className="custom_select_container" onClick={() => setExitDropdown(!exitDropdown)} style={{width:'100%'}}>*/}
                {/*      {exitCriterion}<Image width={20} height={21} src={!exitDropdown ? '/images/dropdown_down.png' : '/images/dropdown_up.png'} alt="expand-icon"/>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*      {exitDropdown && <div className="custom_select_options" ref={exitRef} style={{width:'100%'}}>*/}
                {/*        {exitCriteria.map((exit, index) => (<div key={index} className="custom_select_option" onClick={() => handleExitSelect(index)} style={{padding:'12px 14px',maxWidth:'100%'}}>*/}
                {/*          {exit}*/}
                {/*        </div>))}*/}
                {/*      </div>}*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                <div style={{marginTop: '15px'}}>
                  <label className={styles.form_label}>Time between steps (in milliseconds)</label>
                  <input className="input_medium" type="number" value={stepTime} onChange={handleStepChange}/>
                </div>
                <div style={{marginTop: '15px'}}>
                  <label className={styles.form_label}>Short term memory - Rolling window</label>
                  <div className="dropdown_container_search" style={{width:'100%'}}>
                    <div className="custom_select_container" onClick={() => setRollingDropdown(!rollingDropdown)} style={{width:'100%'}}>
                      {rollingWindow} messages<Image width={20} height={21} src={!rollingDropdown ? '/images/dropdown_down.png' : '/images/dropdown_up.png'} alt="expand-icon"/>
                    </div>
                    <div>
                      {rollingDropdown && <div className="custom_select_options" ref={rollingRef} style={{width:'100%'}}>
                        {rollingWindows.map((window, index) => (<div key={index} className="custom_select_option" onClick={() => handleWindowSelect(index)} style={{padding:'12px 14px',maxWidth:'100%'}}>
                          {window}
                        </div>))}
                      </div>}
                    </div>
                  </div>
                </div>
                <div style={{marginTop: '15px'}}>
                  <div style={{display:'flex'}}>
                    <input className="checkbox" type="checkbox" checked={longTermMemory} onChange={() => setLongTermMemory(!longTermMemory)} />
                    <label className={styles.form_label} style={{marginLeft:'7px',cursor:'pointer'}} onClick={() => setLongTermMemory(!longTermMemory)}>
                      Long term memory
                    </label>
                  </div>
                </div>
                {longTermMemory === true && <div style={{marginTop: '10px'}}>
                  <label className={styles.form_label}>Choose an LTM database</label>
                  <div className="dropdown_container_search" style={{width:'100%'}}>
                    <div className="custom_select_container" onClick={() => setDatabaseDropdown(!databaseDropdown)} style={{width:'100%'}}>
                      {database}<Image width={20} height={21} src={!databaseDropdown ? '/images/dropdown_down.png' : '/images/dropdown_up.png'} alt="expand-icon"/>
                    </div>
                    <div>
                      {databaseDropdown && <div className="custom_select_options" ref={databaseRef} style={{width:'100%'}}>
                        {databases.map((data, index) => (<div key={index} className="custom_select_option" onClick={() => handleDatabaseSelect(index)} style={{padding:'12px 14px',maxWidth:'100%'}}>
                          {data}
                        </div>))}
                      </div>}
                    </div>
                  </div>
                </div>}
                <div style={{marginTop: '15px'}}>
                  <label className={styles.form_label}>Permission Type</label>
                  <div className="dropdown_container_search" style={{width:'100%'}}>
                    <div className="custom_select_container" onClick={() => setPermissionDropdown(!permissionDropdown)} style={{width:'100%'}}>
                      {permission}<Image width={20} height={21} src={!permissionDropdown ? '/images/dropdown_down.png' : '/images/dropdown_up.png'} alt="expand-icon"/>
                    </div>
                    <div>
                      {permissionDropdown && <div className="custom_select_options" ref={permissionRef} style={{width:'100%'}}>
                        {permissions.map((permit, index) => (<div key={index} className="custom_select_option" onClick={() => handlePermissionSelect(index)} style={{padding:'12px 14px',maxWidth:'100%'}}>
                          {permit}
                        </div>))}
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            }
            <div style={{marginTop: '15px', display: 'flex', justifyContent: 'flex-end'}}>
              <button className={styles.agent_button} onClick={handleAddAgent}>Add agent</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer/>
  </>)
}