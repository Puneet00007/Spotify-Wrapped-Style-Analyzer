import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function GenreDonut({ data }: { data: { name: string, value: number, color: string }[] }) {
  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">DNA</span>
      </div>
    </div>
  );
}