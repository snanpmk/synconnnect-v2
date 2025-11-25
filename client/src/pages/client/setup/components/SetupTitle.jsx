const SetupTitle = ({ Icon, title, description }) => (
  <div className="flex items-start mb-4 border-b border-gray-200 pb-3">
    <Icon className="w-6 h-6 mr-3 mt-1 flex-shrink-0 text-primary" />
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default SetupTitle;
