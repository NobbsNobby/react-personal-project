// Core
import React, { PureComponent } from 'react';

//Components
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';
// Instruments
import Styles from './styles.m.css';
import classNames from 'classnames';


export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
    };

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

    _setTaskEditing = (status) => {
        this.setState({ isTaskEditing: status });
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        // if (isTaskEditing) {
        //     this._updateTask();
        //
        //     return null;
        // }
        this._setTaskEditing(true);
    };

    _changeTaskCompletedState = () => {
        const { _changeTaskCompletedState, id } = this.props;

        _changeTaskCompletedState(id);
    };

    _changeTaskFavoriteState = () => {
        const { _changeTaskFavoriteState, id } = this.props;

        _changeTaskFavoriteState(id);
    }

    render () {
        const { message, completed, favorite } = this.props;
        const { isTaskEditing } = this.state;

        const completedClass = classNames(Styles.task, { [Styles.completed]: completed });

        return (<li className = { completedClass }>
            <div className = { Styles.content }>
                <Checkbox
                    inlineBlock
                    checked = { completed }
                    className = { Styles.toggleTaskCompletedState }
                    color1 = '#3B8EF3'
                    color2 = '#FFF'
                    onClick = { this._changeTaskCompletedState }
                />
                <input
                    disabled = { !isTaskEditing }
                    type = 'text'
                    value = { message }
                />
            </div>
            <div className = { Styles.actions } >
                <Star
                    inlineBlock
                    checked = { favorite }
                    className = { Styles.toggleTaskFavoriteState }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    onClick = { this._changeTaskFavoriteState }
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
                    inlineBlock
                    color1 = '#3B8EF3'
                    color2 = '#000'
                />
            </div>
        </li>);
    }
}
