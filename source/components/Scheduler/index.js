// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import Spinner from 'components/Spinner';
import Checkbox from 'theme/assets/Checkbox';
// Instruments
import Styles from './styles.m.css';
import { sortTasksByGroup } from 'instruments';
import FlipMove from 'react-flip-move';
import { v4 } from 'uuid';
// ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { api } from '../../REST';

const data = [
    {
        "id":        "5a7f136231a5d90001271637",
        "message":   "Hello Andrey!",
        "completed": true,
        "favorite":  false,
        "created":   "2018-02-10T15:44:34.624Z",
        "modified":  "2018-02-10T16:01:12.406Z",
    },
    {
        "id":        "5a7f136131a5d90001271636",
        "message":   "Hello",
        "completed": false,
        "favorite":  true,
        "created":   "2018-02-10T15:44:33.675Z",
    },
    {
        "id":        "5a7f136031a5d90001271635",
        "message":   "Hello",
        "completed": false,
        "favorite":  false,
        "created":   "2018-02-10T15:44:32.959Z",
    }
];

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: true,
        tasks:           data,
    };

    _changeTaskCompletedState = (id) => {

        this.setState(({ tasks }) => ({
            tasks: tasks.map((el) => {
                if (el.id !== id) {
                    return el;
                }

                return { ...el, completed: !el.completed };
            }),
        }));
    };

    _changeTaskFavoriteState = (id) => {

        this.setState(({ tasks }) => ({
            tasks: tasks.map((el) => {
                if (el.id !== id) {
                    return el;
                }

                return { ...el, favorite: !el.favorite };
            }),
        }));
    };

    _removeTask = (id) => {
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((el) => el.id !== id),
        }));

    };
    _checkAllTasksCompleted = () => this.state.tasks.every((task) => task.completed);

    _checkedAllTasks = () => {
        this.setState(({ tasks }) => ({
            tasks: tasks.map((el) => ({ ...el, completed: true })),
        }));

    };

    _changeNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _addNewTaskMessage = (event) => {
        event.preventDefault();

        const { newTaskMessage } = this.state;

        const task = {
            id:        v4(),
            completed: false,
            favorite:  false,
            message:   newTaskMessage,
        };

        this.setState(({ tasks }) => ({
            tasks: [...tasks, task ],
        }));

    };

    render () {
        const {
            newTaskMessage,
            tasksFilter,
            isTasksFetching,
            tasks,
        } = this.state;

        const tasksJSX = sortTasksByGroup(tasks).map((el) => (
            <Task
                key = { el.id }
                { ...el }
                _changeTaskCompletedState = { this._changeTaskCompletedState }
                _changeTaskFavoriteState = { this._changeTaskFavoriteState }
                _removeTask = { this._removeTask }
            />));

        const allTasksCompleted = this._checkAllTasksCompleted();

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTasksFetching } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' />
                    </header>
                    <section>
                        <form onSubmit = { this._addNewTaskMessage }>
                            <input
                                maxLength = '5'
                                placeholder = 'Описание задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._changeNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <FlipMove>{tasksJSX}</FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { allTasksCompleted }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._checkedAllTasks }
                        />
                        <span className = { Styles.completeAllTasks }>Выполнить все задачи</span>
                    </footer>
                </main>
            </section>
        );
    }
}
