import React, { useState } from "react";
import * as styles from './Dashboard.module.css';
import { Bell, Calendar, Plus, Search, Clock, FileText, Users, Flag, CheckCircle, XCircle, MinusCircle, Circle, AlertCircle, FastForward } from 'react-feather'; // Importa más iconos según sea necesario
import { useDataStore } from "../../store/data_store";
import { useTaskService } from "../../services/taskService";

const {
    dashboardContainer,
    header,
    headerLeft,
    userWelcome,
    headerRight,
    searchBar,
    actionButtons,
    scheduleButton,
    createRequestButton,
    widgetsContainer,
    widget,
    widgetHeader,
    widgetBody,
    progressBar,
    progressBarTrack,
    progressBarIndicator,
    progressBarText,
    listItem,
    listItemIndicator,
    listItemContent,
    listItemStatus,
    currentProjectDetails,
    projectInfoRow,
    teamMembers,
    timelineBar,
    scheduleCalendar,
    calendarHeader,
    calendarDays,
    day,
    notesList,
    noteItem,
    statusTrackerList,
    statusItem,
    statusIndicator,
    statusText,
    statusTime,
    meetingItem,
    meetingInfo,
    meetingTime,
    meetingTitle,
    meetingParticipants,
    meetingLocation,
    meetingTag,
    noteContainer,
    circleIcon
} = styles;

function Dashboard() {
    const tasks = useDataStore(state => state.tasks)
    const nextTasks = Object.values(tasks)
    .filter(task => task.status === 'in_progress')



    return (
        <div className={dashboardContainer}>

            <header className={header}>

                <div className={headerLeft}>
                    <div className={userWelcome}>
                        <h1>Sophia Williams</h1>
                        <p>Welcome back to Synergy</p>
                    </div>
                </div>

                <div className={headerRight}>
                    <div className={searchBar}>
                        <Search size={16} />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className={actionButtons}>
                        <Bell size={20} />
                        <button className={scheduleButton}>
                            <Calendar size={16} /> Schedule
                        </button>
                        <button className={createRequestButton}>
                            <Plus size={16} /> Create a Request
                        </button>
                    </div>

                </div>
            </header>

            <div className={widgetsContainer}>

            <div className={widget}>

                    <div className={widgetHeader}>
                        <h3><FastForward size={16} className="inline-icon" />Next Actions</h3>
                        <a href="#">See All</a>
                    </div>

                    <div className={widgetBody}>
                        <ul className={notesList}>
                            {
                                nextTasks.map((task) => (
                                    <NextTaskItem taskId={task.id}/>
                                ))
                            }
                        </ul>
                    </div>

                </div>

                <div className={widget}>
                    <div className={widgetHeader}>
                        <h3><Clock size={16} className="inline-icon" /> Time Off</h3>
                        <a href="#">See All</a>
                    </div>
                    <div className={widgetBody}>
                        <div className={progressBar}>
                            <div className={progressBarTrack}>
                                <div className={progressBarIndicator} style={{ width: '80%' }}></div>
                            </div>
                            <div className={progressBarText}>
                                <span>16</span>
                                <span>OUT OF 20</span>
                            </div>
                        </div>
                        <ul className={styles.list}>
                            <li className={listItem}>
                                <span className={listItemIndicator} style={{ backgroundColor: '#F44336' }}></span>
                                <div className={listItemContent}>
                                    <p>Aug 11, 2023 <span>(Sick)</span></p>
                                </div>
                                <span className={listItemStatus}>Pending</span>
                            </li>
                            <li className={listItem}>
                                <span className={listItemIndicator} style={{ backgroundColor: '#4CAF50' }}></span>
                                <div className={listItemContent}>
                                    <p>July 15, 2023 <span>(Annual)</span></p>
                                </div>
                                <span className={listItemStatus}>Confirmed</span>
                            </li>
                            <li className={listItem}>
                                <span className={listItemIndicator} style={{ backgroundColor: '#FF9800' }}></span>
                                <div className={listItemContent}>
                                    <p>Jun 24, 2023 <span>(Casual)</span></p>
                                </div>
                                <span className={listItemStatus}>Rejected</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={widget}>
                    <div className={widgetHeader}>
                        <h3><Flag size={16} className="inline-icon" /> Current Project</h3>
                        <a href="#">See All</a>
                    </div>
                    <div className={widgetBody}>
                        <div className={currentProjectDetails}>
                            <div className={projectInfoRow}>
                                <label>Project Name</label>
                                <span>Monday App Design <span className={styles.statusBadge} style={{ backgroundColor: '#FFC107', color: '#333' }}>In Progress</span></span>
                            </div>
                            <div className={projectInfoRow}>
                                <label>Project Manager</label>
                                <span>Laura P.</span>
                            </div>
                            <div className={projectInfoRow}>
                                <label>Design Lead</label>
                                <span>Arthur G.</span>
                            </div>
                            <div className={projectInfoRow}>
                                <label>Team</label>
                                <div className={teamMembers}>
                                    <div className={styles.avatar}></div>
                                    <div className={styles.avatar} style={{ backgroundColor: '#9C27B0' }}></div>
                                    <div className={styles.avatar} style={{ backgroundColor: '#2196F3' }}></div>
                                    <div className={styles.avatar} style={{ backgroundColor: '#00BCD4' }}></div>
                                    <span>+8 people</span>
                                </div>
                            </div>
                            <div className={projectInfoRow}>
                                <label>Timeline</label>
                                <div className={timelineBar}>
                                    <div style={{ width: '60%', backgroundColor: '#4CAF50', height: '8px', borderRadius: '4px' }}></div>
                                </div>
                                <span>12/10/2022 - 01/04/2023</span>
                            </div>
                            <div className={projectInfoRow}>
                                <label>Description</label>
                                <span>Mobile and desktop app design for the ne...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={widget}>
                    <div className={widgetHeader}>
                        <h3><Calendar size={16} className="inline-icon" /> Schedule</h3>
                        <a href="#">See All</a>
                    </div>
                    <div className={widgetBody}>
                        <div className={scheduleCalendar}>
                            <div className={calendarHeader}>
                                <button>&lt;</button>
                                <span>Aug, 2023</span>
                                <button>&gt;</button>
                            </div>
                            <div className={calendarDays}>
                                <span className={day}>Su</span>
                                <span className={day}>Mo</span>
                                <span className={day}>Tu</span>
                                <span className={day}>We</span>
                                <span className={day}>Th</span>
                                <span className={day}>Fr</span>
                                <span className={day}>Sa</span>
                                <span className={day} style={{ color: '#ccc' }}>30</span>
                                <span className={day} style={{ color: '#ccc' }}>31</span>
                                <span className={`${day}`}>1</span>
                                <span className={`${day}`}>2</span>
                                <span className={`${day}`}>3</span>
                                <span className={`${day}`}>4</span>
                                <span className={`${day}`}>5</span>
                                {/* ... more days ... */}
                            </div>
                        </div>
                        <div className={styles.scheduleTabs}>
                            <button className={styles.activeTab}>Meetings</button>
                            <button>Events</button>
                            <button>Holiday</button>
                        </div>
                        <ul className={styles.meetingList}>
                            <li className={meetingItem}>
                                <div className={meetingInfo}>
                                    <span className={meetingTime}>8:00 - 8:45 AM (UTC)</span>
                                    <h4 className={meetingTitle}>Meeting with James Brown</h4>
                                    <div className={meetingParticipants}>
                                        <Users size={14} /> <span>+2</span>
                                    </div>
                                    <span className={meetingLocation}>On Google Meet</span>
                                </div>
                                <span className={meetingTag} style={{ backgroundColor: '#FFAB91', color: '#333' }}>MARKETING</span>
                            </li>
                            <li className={meetingItem}>
                                <div className={meetingInfo}>
                                    <span className={meetingTime}>9:00 - 9:45 AM (UTC)</span>
                                    <h4 className={meetingTitle}>Meeting with Laura Perez</h4>
                                    <div className={meetingParticipants}>
                                        <Users size={14} /> <span>+2</span>
                                    </div>
                                    <span className={meetingLocation}>On Zoom</span>
                                </div>
                                <span className={meetingTag} style={{ backgroundColor: '#80CBC4', color: '#333' }}>PRODUCT MANAGER</span>
                            </li>
                            <li className={meetingItem}>
                                <div className={meetingInfo}>
                                    <span className={meetingTime}>10:00 - 11:00 AM (UTC)</span>
                                    <h4 className={meetingTitle}>Meeting with Arthur Taylor</h4>
                                    <div className={meetingParticipants}>
                                        <Users size={14} /> <span>+2</span>
                                    </div>
                                    <span className={meetingLocation}>On Slack</span>
                                </div>
                                <span className={meetingTag} style={{ backgroundColor: '#CE93D8', color: '#333' }}>PARTNERSHIP</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={widget}>
                    <div className={widgetHeader}>
                        <h3><FileText size={16} className="inline-icon" /> Notes</h3>
                        <a href="#">See All</a>
                    </div>
                    <div className={widgetBody}>
                        <ul className={notesList}>
                            <li className={noteItem}>
                                <strong>Text inputs for Design System</strong>
                                <p>Search for inspiration to provide a rich con...</p>
                                <div className={styles.noteMeta}>
                                    <span className={styles.noteTag} style={{ backgroundColor: '#FFEB3B', color: '#333' }}>Today</span>
                                    <span className={styles.noteTag}>To-do</span>
                                    <span><Clock size={12} /> Aug 02</span>
                                </div>
                            </li>
                            <li className={noteItem}>
                                <strong>Meeting with Arthur Taylor</strong>
                                <p>Discuss the MVP version of Apex Mobile a...</p>
                                <div className={styles.noteMeta}>
                                    <span className={styles.noteTag}>Today</span>
                                    <span className={styles.noteTag} style={{ backgroundColor: '#4CAF50', color: 'white' }}>Meeting</span>
                                    <span><Clock size={12} /> Aug 02</span>
                                </div>
                            </li>
                            <li className={noteItem}>
                                <strong>Check neutral and state colors</strong>
                                <p>Button components will be revised and de...</p>
                                <div className={styles.noteMeta}>
                                    <span className={styles.noteTag} style={{ backgroundColor: '#F44336', color: 'white' }}>Yesterday</span>
                                    <span className={styles.noteTag} style={{ backgroundColor: '#2196F3', color: 'white' }}>Important</span>
                                    <span><Clock size={12} /> Aug 01</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={widget}>
                    <div className={widgetHeader}>
                        <h3><Users size={16} className="inline-icon" /> Status Tracker</h3>
                        <a href="#">See All</a>
                    </div>
                    <div className={widgetBody}>
                        <ul className={statusTrackerList}>
                            <li className={statusItem}>
                                <div className={styles.userAvatar}></div>
                                <div className={statusText}>
                                    <strong>James Brown</strong>
                                    <p className={styles.secondaryText}>Replaced by Laura Perez</p>
                                </div>
                                <span className={statusIndicator} style={{ backgroundColor: '#F44336' }}>Absent</span>
                            </li>
                            <li className={statusItem}>
                                <div className={styles.userAvatar} style={{ backgroundColor: '#9C27B0' }}>SW</div>
                                <div className={statusText}>
                                    <strong>Sophia Williams</strong>
                                    <p className={styles.secondaryText}>Synergy</p>
                                </div>
                                <span className={statusTime}>25m</span>
                                <span className={statusIndicator} style={{ backgroundColor: '#FF9800' }}>Away</span>
                            </li>
                            <li className={statusItem}>
                                <div className={styles.userAvatar} style={{ backgroundColor: '#2196F3' }}>AT</div>
                                <div className={statusText}>
                                    <strong>Arthur Taylor</strong>
                                    <p className={styles.secondaryText}>Apex</p>
                                </div>
                                <span className={statusTime}>12m</span>
                                <span className={statusIndicator} style={{ backgroundColor: '#4CAF50' }}>Online</span>
                            </li>
                            <li className={statusItem}>
                                <div className={styles.userAvatar} style={{ backgroundColor: '#00BCD4' }}>EW</div>
                                <div className={statusText}>
                                    <strong>Emma Wright</strong>
                                    <p className={styles.secondaryText}>Pulse</p>
                                </div>
                                <span className={statusTime}>8m</span>
                                <span className={statusIndicator} style={{ backgroundColor: '#4CAF50' }}>Online</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}

function NextTaskItem ({taskId}) {
    const task = useDataStore(state => state.tasks[taskId])
    const sections = useDataStore(state => state.sections)
    const projects = useDataStore(state => state.projects)
    const [check, setCheck] = useState(task.status)
    const {changeStatus} = useTaskService()

    const handleCheck = () => {
        setCheck('completed')
        changeStatus(taskId, true)
    }

    return(
        <li className={noteContainer}>
            <div className={noteItem}>
                <strong>{task.item_name}</strong>
                <p>{task.description}</p>
                <div className={styles.noteMeta}>
                    <span
                    className={styles.noteTag}
                    style={{ backgroundColor: `rgba(${projects[sections[task.parent_id].parent_id].myColor.color},0.5)`, color: 'black' }}>
                    {projects[sections[task.parent_id].parent_id].item_name}
                    </span>
                </div>
            </div>

            <div>
                {check == 'in_progress' ?
                    <Circle
                    className={circleIcon}
                    onClick={handleCheck}
                    />
                :
                    <AlertCircle
                    />
                }
            </div>
        </li>
    )
}

export { Dashboard };
