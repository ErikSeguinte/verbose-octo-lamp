import { DateTime } from "luxon";


const Timezone = () => {

    const timezoneNames: string[] = Intl.supportedValuesOf("timeZone")
    const tzList = timezoneNames.map((tz) => <option key={"z" + tz}> {tz} </option>)

    return (
        <div className='flex flex-col justify-center items-center'>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text">Please select you Timezone</span>
                </div>
                <select className="select select-bordered" suppressHydrationWarning>
                    {tzList}
                </select>
            </label>
        </div>)
}

export default Timezone