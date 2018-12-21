// Core
import React, { PureComponent } from 'react';

//Components
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';
// Instruments
import Styles from './styles.m.css';
import cx from 'classnames';

export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (status) => {
        this.setState({ isTaskEditing: status }, () => {
            if (status) {
                this.taskInput.current.focus();
            }
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        this._setTaskEditingState(false);
        if (newMessage === message) {
            return null;
        }
        _updateTaskAsync(this._getTaskShape({ message: newMessage }));
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        this.setState((state, props) => ({
            isTaskEditing: false,
            newMessage:    props.message,
        }));

    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;
        const enterKey = event.key === 'Enter';
        const escKey = event.key === 'Escape';

        if (!newMessage.trim()) {
            return null;
        }

        if (enterKey) {
            this._updateTask();
        }

        if (escKey) {
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(this._getTaskShape({ completed: !completed }));
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(this._getTaskShape({ favorite: !favorite }));
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    render () {
        const { completed, favorite } = this.props;
        const { isTaskEditing, newMessage } = this.state;

        const completedClass = cx(Styles.task, { [Styles.completed]: completed });

        return (<li className = { completedClass }>
            <div className = { Styles.content }>
                <Checkbox
                    inlineBlock
                    checked = { completed }
                    className = { Styles.toggleTaskCompletedState }
                    color1 = '#3B8EF3'
                    color2 = '#FFF'
                    onClick = { this._toggleTaskCompletedState }
                />
                <input
                    disabled = { !isTaskEditing }
                    maxLength = { 50 }
                    ref = { this.taskInput }
                    type = 'text'
                    value = { newMessage }
                    onChange = { this._updateNewTaskMessage }
                    onKeyDown = { this._updateTaskMessageOnKeyDown }
                />
            </div>
            <div className = { Styles.actions } >
                <Star
                    inlineBlock
                    checked = { favorite }
                    className = { Styles.toggleTaskFavoriteState }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    onClick = { this._toggleTaskFavoriteState }
                />
                <Edit
                    inlineBlock
                    checked = { isTaskEditing }
                    className = { Styles.updateTaskMessageOnClick }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    onClick = { this._updateTaskMessageOnClick }
                />
                <Remove
                    className = { Styles.removeTask }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    inlineBlock
                    onClick = { this._removeTask }
                />
            </div>
        </li>);
    }
}
