// Core
import React, { Component } from "react";

//Components
import Task from "components/Task";
import Spinner from "components/Spinner";
import Checkbox from "theme/assets/Checkbox";

// Instruments
import Styles from "./styles.m.css";
import { sortTasksByGroup } from "instruments";
import FlipMove from "react-flip-move";
import { v4 } from "uuid";
import { api } from "../../REST";

export default class Scheduler extends Component {
  state = {
      newTaskMessage:  "",
      tasksFilter:     "",
      isTasksFetching: false,
      tasks:           [],
  };

  componentDidMount () {
      this._setTasksFetchingState(true);
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
      const tasks = await api.fetchTasks();

      this._setTasksFetchingState(true);

      this.setState({
          tasks,
      });

      this._setTasksFetchingState(false);
  };

  _createTaskAsync = async (event) => {
      const { newTaskMessage } = this.state;

      event.preventDefault();
      if (!newTaskMessage.trim()) {
          return null;
      }

      this._setTasksFetchingState(true);

      const task = await api.createTask(newTaskMessage);

      this.setState(({ tasks }) => ({
          tasks:          [...tasks, task],
          newTaskMessage: "",
      }));

      this._setTasksFetchingState(false);
  };

  _updateTaskAsync = async (updateTask) => {
      const tasksData = await api.updateTask(updateTask);

      this._setTasksFetchingState(true);

      this.setState(({ tasks }) => ({
          tasks: tasks.map((task) => {
              const el = tasksData.find((taskDataEl) => task.id === taskDataEl.id);

              return el ? el : task;
          }),
      }));

      this._setTasksFetchingState(false);
  };

  _removeTaskAsync = async (id) => {
      this._setTasksFetchingState(true);

      await api.removeTask(id);

      this.setState(({ tasks }) => ({
          tasks: tasks.filter((el) => el.id !== id),
      }));

      this._setTasksFetchingState(false);
  };

  _completeAllTasksAsync = async () => {
      if (this._getAllCompleted()) {
          return null;
      }
      this._setTasksFetchingState(true);

      await api.completeAllTasks(this.state.tasks);

      this.setState(({ tasks }) => ({
          tasks: tasks.map((el) => ({ ...el, completed: true })),
      }));

      this._setTasksFetchingState(false);
  };

  _removeTask = (id) => {
      this.setState(({ tasks }) => ({
          tasks: tasks.filter((el) => el.id !== id),
      }));
  };

  _taskArrayFilter = (el) => {
      const { tasksFilter } = this.state;

      return el.message.toLowerCase().includes(tasksFilter);
  };

  render () {
      const { newTaskMessage, isTasksFetching, tasks, tasksFilter } = this.state;

      const tasksJSX = sortTasksByGroup(tasks.filter(this._taskArrayFilter)).map(
          (el) => (
              <Task
                  key = { el.id }
                  { ...el }
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
                              <FlipMove>{tasksJSX}</FlipMove>
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
