const {useState, useEffect} = React
import { LabelSelector } from "./LabelSelect.jsx"

export function BugFilter({filterBy, onSetFilter}) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

	const labels = ['critical', 'CR', 'dev-branch', 'popular', 'high']


  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({target}) {
    const field = target.name
    const value = target.type === 'number' ? +target.value || '' : target.value
    setFilterByToEdit((prevFilterBy) => ({...prevFilterBy, [field]: value}))
  }

  function onLabelChange(selectedLabels) {

		setFilterByToEdit(prevFilter => ({
			...prevFilter,
			labels: selectedLabels,
		}))
	}

  // function onSubmitFilter(ev) {
  //   ev.preventDefault()
  //   onSetFilter(filterByToEdit)
  // }

  const {txt, severity} = filterByToEdit
  return (
    <section className="bug-filter full main-layout">
      <h2>Filter Our Bugs</h2>

      {/* <form onSubmit={onSubmitFilter}> */}
        <label htmlFor="txt">Vendor:</label>
        <input
          value={txt}
          onChange={handleChange}
          name="txt"
          id="txt"
          type="text"
          placeholder="By Text"
        />

        <label htmlFor="severity">Severity:</label>
        <input
          value={severity}
          onChange={handleChange}
          type="number"
          name="severity"
          id="severity"
          placeholder="By Severity"
        />
			<LabelSelector labels={labels} onLabelChange={onLabelChange} />

        <button>Filter Bugs</button>
      {/* </form> */}
    </section>
  )
}
