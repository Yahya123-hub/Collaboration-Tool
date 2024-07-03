import PropTypes from 'prop-types'; 
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarController, // Import BarController for bar chart
  CategoryScale, // Import CategoryScale for bar chart
  LinearScale,
  BarElement, // Import BarElement for bar chart
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarController, // Register BarController
  CategoryScale, // Register CategoryScale
  LinearScale,
  BarElement // Register BarElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const ChartComponent = ({ data, labels, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: labels.map((label, index) => {
          const dataPoint = data.find((d) => d._id === label || d._id === index + 1);
          return dataPoint ? dataPoint.count : 0;
        }),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgb(52,120,243,255)",
      },
    ],
  };

  return <Bar options={{...options, plugins: { ...options.plugins, title: { text: title, display: true } }}} data={chartData} />;
};

ChartComponent.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default ChartComponent;
