const FieldGroup = ({ label, fields, values = {}, onChange }) => {
  const getFieldColor = (field) => {
    if (field === "generated")
      return "border-green-500 focus:ring-green-500 focus:border-green-500";
    if (field === "added")
      return "border-blue-500 focus:ring-blue-500 focus:border-blue-500";
    if (field === "fixed")
      return "border-orange-500 focus:ring-orange-500 focus:border-orange-500";
    return "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
  };

  const getFieldLabel = (field) => {
    if (field === "generated") return "🤖 Generated";
    if (field === "added") return "✍️ Added";
    if (field === "fixed") return "🔧 Fixed";
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {getFieldLabel(field)}
            </label>
            <input
              type="number"
              value={values[field] ?? 0}
              onChange={(e) => onChange(field, e.target.value)}
              min="0"
              className={`block w-full px-3 py-2 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-all ${getFieldColor(field)}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldGroup;
