import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './style.css';

const renderData = data => {
    return(
        <ul>
            { data.map((todo, index) => (
                <li key={todo.index}>{todo.title}</li>
            )) }
        </ul>
    )
}

function PaginationComponent() {
    
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    const [pageNumberLimit, setPageNumberLimit] = useState(5)
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5)
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0)

    const handleClick = (event) => (
        setCurrentPage(Number(event.target.id))
    )

    const pages = [];

    for(let i=1; i<=Math.ceil(data.length / itemsPerPage); i++){
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = data.slice(indexOfFirstItem, indexOfLastItem);
    
    const renderPageNumbers = pages.map(number => {

        if(number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {

            return(
                <li key={ number } id={ number } onClick={handleClick} className={currentPage === number ? 'active' : null}>
                    { number }
                </li>
            );
        } else {
            return null;
        }
    });


    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/todos')
        .then(res => {
            setData(res.data)
        })
    }, [])


    const handleNextBtn = () => {

        setCurrentPage(currentPage + 1);

        if((currentPage + 1) > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    }

    const handlePrevtBtn = () => {

        setCurrentPage(currentPage - 1);

        if((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    }

    let pageIncrementBtn = null;
    if(pages.length > maxPageNumberLimit) {
        pageIncrementBtn = <li className='next' onClick={ handleNextBtn }> &hellip; </li>
    }

    let pageDecrementBtn = null;
    if(minPageNumberLimit >= 1) {
        pageDecrementBtn = <li className='previous' onClick={ handlePrevtBtn }> &hellip; </li>
    }

    const handleLoadMore = () => {
        setItemsPerPage(itemsPerPage + 5);
    }

    return (
        <div>
            <h1>Todo List</h1>
            <br />

            { renderData(currentItem) }

            <ul className="pageNumber">
                <li><button onClick={ handlePrevtBtn } disabled={ currentPage === pages[0] ? true : false }>Prev</button></li>
                { pageDecrementBtn }
                { renderPageNumbers }
                { pageIncrementBtn }
                <li><button onClick={ handleNextBtn } disabled={ currentPage === pages[pages.length - 1] ? true : false }>Next</button></li>
            </ul>
            <button className="loadmore" onClick={handleLoadMore}>
                Load More
            </button>
        </div>
    )
}

export default PaginationComponent;
