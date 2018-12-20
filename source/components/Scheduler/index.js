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

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._setTasksFetchingState(true);
        this._asyncFetchTask();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    // Асинхронные запросы
    _asyncFetchTask = async () => {
        const tasks = await api.fetchTasks();

        console.log(tasks);
        this.setState({
            tasks,
            isTasksFetching: false,
        });
    };

    _asyncAddTask = async (event) => {
        event.preventDefault();
        const { newTaskMessage } = this.state;

        this._setTasksFetchingState(true);
        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:           [...tasks, task],
            isTasksFetching: false,
        }));
    };

    _asyncRemoveTask = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks:           tasks.filter((el) => el.id !== id),
            isTasksFetching: false,
        }));

    };

    _asyncUpdateTasks = async (updateTask) => {
        this._setTasksFetchingState(true);
        const tasksData = await api.updateTask(updateTask);

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => {
                const el = taskData.find((taskDataEl) => task.id === taskDataEl.id);

                return el ? el : task;

            }),
            isTasksFetching: false,
        }));

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

    _checkAllTasksCompleted = () =>
        this.state.tasks.length !== 0 && this.state.tasks.every((task) => task.completed)

    ;

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
                _changeTaskCompletedState = { this._asyncUpdateTasks }
                _changeTaskFavoriteState = { this._asyncUpdateTasks }
                _removeTask = { this._asyncRemoveTask }
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
                        <form onSubmit = { this._asyncAddTask }>
                            <input
                                maxLength = '50'
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
