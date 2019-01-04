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
import { api } from '../../REST';

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLocaleLowerCase(),
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _getAllCompleted = () => this.state.tasks.every((task) => task.completed);

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    // Асинхронные запросы
    _fetchTasksAsync = async () => {
        try {
            const tasks = await api.fetchTasks();

            this._setTasksFetchingState(true);

            this.setState({
                tasks,
            });
        } catch (e) {
            console.log(e.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTaskAsync = async (event) => {
        try {
            event.preventDefault();
            const { newTaskMessage } = this.state;

            if (!newTaskMessage.trim()) {
                return null;
            }

            this._setTasksFetchingState(true);

            const task = await api.createTask(newTaskMessage);

            this.setState(({ tasks }) => ({
                tasks:          [task, ...tasks],
                newTaskMessage: '',
            }));
        } catch (e) {
            console.log(e.message);
        } finally {
            this._setTasksFetchingState(false);
        }

    };

    _updateTaskAsync = async (updateTask) => {
        try {
            const tasksData = await api.updateTask(updateTask);

            this._setTasksFetchingState(true);

            this.setState(({ tasks }) => ({
                tasks: tasks.map((task) => {
                    return task.id === tasksData[0].id
                        ? tasksData[0]
                        : task;
                }),
            }));
        } catch (e) {
            console.log(e.message);
        } finally {
            this._setTasksFetchingState(false);
        }

    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);

            await api.removeTask(id);

            this.setState(({ tasks }) => ({
                tasks: tasks.filter((el) => el.id !== id),
            }));
        } catch (e) {
            console.log(e.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {
        try {
            if (this._getAllCompleted()) {
                return null;
            }
            this._setTasksFetchingState(true);

            await api.completeAllTasks(this.state.tasks);

            this.setState(({ tasks }) => ({
                tasks: tasks.map((el) => ({ ...el, completed: true })),
            }));
        } catch (e) {
            console.log(e.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTask = (id) => {
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((el) => el.id !== id),
        }));
    };

    _taskArrayFilter = (el) => {
        const { tasksFilter } = this.state;

        return el.message.toLocaleLowerCase().includes(tasksFilter);
    };

    render () {
        const { newTaskMessage, isTasksFetching, tasks, tasksFilter } = this.state;

        const tasksJSX = sortTasksByGroup(tasks.filter(this._taskArrayFilter)).map(
            (task) => (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            )
        );

        const allTasksCompleted = this._getAllCompleted();

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTasksFetching } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            maxLength = { 50 }
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                maxLength = { 50 }
                                placeholder = 'Описание задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <FlipMove>{ tasksJSX }</FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { allTasksCompleted }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
              Выполнить все задачи
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
