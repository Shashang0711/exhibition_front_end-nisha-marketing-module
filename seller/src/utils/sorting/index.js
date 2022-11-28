const sortData = (e, dbColName, setSorting, setArrowClass) => {
  const column = e.target;
  let sortBy = dbColName;

  const arrows = column.getElementsByTagName('img');
  if (arrows[0].classList.contains('active')) {
    setSorting({
      sortBy,
      order: 'ASC'
    });
    setArrowClass({
      [sortBy]: ['', 'active']
    });
  } else if (arrows[1].classList.contains('active')) {
    setSorting({
      sortBy,
      order: 'DESC'
    });
    setArrowClass({
      [sortBy]: ['active', '']
    });
  } else {
    setSorting({
      sortBy,
      order: 'DESC'
    });
    setArrowClass({
      [sortBy]: ['active', '']
    })
  }
}

export { sortData };
