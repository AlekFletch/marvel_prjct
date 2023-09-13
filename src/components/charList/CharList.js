import './charList.scss';

import {useState, useEffect, useRef, useMemo} from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';


const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;

        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;

        case 'confirmed':
            return <Component/>

        case 'error':
            return <ErrorMessage/>

        default:
            throw new Error('Unexpected process state')
    }
}

const CharList = (props) => {
    const [charList, setCharlist] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const myRefs = useRef([]);
    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onBlurChar = (index) => {
        myRefs.current[index].classList.remove('char__item_selected');
    }


    const classRefSet = (index) => {

        myRefs.current[index].classList.add('char__item_selected');
    }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(false);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'));

    }

    const onCharListLoaded =  (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        setCharlist(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }


    function renderItems(arr) {

        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <CSSTransition
                    key={item.id}

                    timeout={500}
                    classNames="char__item"
                >
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={el => myRefs.current[i] = el}
                        onFocus={() => classRefSet(i)}
                        onBlur={() => onBlurChar(i)}
                        onClick={() => {
                            props.onCharSelected(item.id);
                        }}
                    >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>

                </CSSTransition>

            )
        });


        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )


    }

    const elements = useMemo(() =>{
        return setContent(process, () => renderItems(charList), newItemLoading)
    }, [process])

    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                style={{'display': charEnded ? 'none' : 'block'}}
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}


export default CharList;