import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts';

function ProgressChart({tasks}) {
    const todo = tasks.filter(t => t.status === "todo").length;
    const inprogress = tasks.filter(t => t.status === "inprogress").length;
    const done = tasks.filter(t => t.status === "done").length;

    const total = tasks.length;
    const completion = total === 0 ? 0 : Math.round((done/total)*100);

    const data = [
        {name:"To Do", value: todo},
        {name: "In Progress", value: inprogress},
        {name: "Done", value: done}
    ];
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
            Progress Overview
            </h2>

            <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            {completion}% Complete
            </span>
        </div>

        <div style={{ width: '100%', height: '256px', minWidth: 0, minHeight: '256px', overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>

        </div>
    );
}

export default ProgressChart;
