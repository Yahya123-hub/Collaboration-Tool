import React from 'react';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import { MemoryRouter } from "react-router-dom"; 
import userEvent from '@testing-library/user-event'; // Import userEvent
import Todo from '../src/components/dashboard/todo';
import exp from 'constants';
require("@testing-library/jest-dom"); 
 jest.mock("chart.js", () => ({
  ...jest.requireActual("chart.js"), 
  register: jest.fn(), 
}));
const { render, screen, waitFor, fireEvent, within } = require("@testing-library/react");
const Dashboard = require("../src/components/db").default;
const Navbar = require ("../src/components/dashboard/dashboard_navbar").default;
const Topnavbar = require("../src/components/navbar").default;
const Todos = require("../src/components/dashboard/todo").default;
const Review = require ("../src/components/dashboard/review").default;
const axios = require("axios");
const { NotificationProvider } = require("../src/components/dashboard/notificationcontext");


jest.mock("axios"); // Mocking axios to prevent real API calls

beforeEach(() => {

   // Mock global window and document properties
   global.window = Object.create(window);
   global.document = window.document;
   global.HTMLElement = window.HTMLElement;
   global.navigator = { userAgent: 'node.js' };
   // Mock ChartJS functions that rely on DOM
   global.ResizeObserver = jest.fn(); // Mock ResizeObserver (if used by chart.js)

  // Mocking API responses to avoid real API calls during tests
  axios.get.mockResolvedValue({ data: [] }); // Mock empty array for data
  axios.delete.mockResolvedValue({}); // Mock successful deletion response
});

async function renderer(MemoryRouter,NotificationProvider,Component){
  render(
    <MemoryRouter>
      <NotificationProvider>
            <Component/>
      </NotificationProvider>
    </MemoryRouter>
  )
}

async function VisibilityCheck(testid){
  const Component = await screen.getByTestId(testid);
  waitFor(()=>expect(Component).toBeVisible());
}

async function addtask(task){
  const input = await screen.getByRole('textbox');
  fireEvent.change(input, {target :{value : task}});
  await expect(input.value).toBe(task)

  const savebtn = await screen.getByText("Save");
  await userEvent.click(savebtn);
  
  const addedtask = await screen.getByText(task)
  await expect(addedtask).toBeInTheDocument();

  const savetodbbtn = await screen.getByRole('button', {name : /Save All to DB/i})
  await savetodbbtn.click();

  const confirmer = await screen.getByText("No Todos to display")
  await expect(confirmer).toBeInTheDocument(); // section cleared, means the todos have been added to db
}


async function addtaskLS(task){
  renderer(MemoryRouter, NotificationProvider, Todo);
  const input = await screen.findByRole('textbox');
  fireEvent.change(input, {target : {value : task}});

  const savebtn = await screen.findByText('Save');
  await userEvent.click(savebtn);

  const addedtask = await screen.findByText(task);
  await expect(addedtask).toBeInTheDocument();
}

async function TableSelector(combox_num, combox_text){

  axios.get.mockResolvedValue({
    data : [
      {
        _id :'1',
        todo : "Mock Task test one",
        priority : "Medium",
        organization : "Personal",
        category : "Entertainment",
        duedate : "2025-02-05",
        status : "Ongoing",
      }
    ]
  })

  await waitFor(()=>screen.findByText('Mock Task test one'));
  const task = screen.getByText('Mock Task test one')
  expect(task).toBeInTheDocument();

  const dropdown = screen.getAllByRole('combobox')[combox_num];
  const option = await screen.findByRole('option', {name : combox_text})

  await userEvent.selectOptions(dropdown, option);
  waitFor(()=>expect(dropdown).toHaveValue(combox_text));
}

test.skip("Dashboard should show correct info attributes", async () => {
  const texts = [
    /Total Tasks/i,
    /High Priority Tasks/i,
    /Tasks Graph/i,
    /Personal Tasks/i,
    /Work Tasks/i,
  ];
  await renderer(MemoryRouter, NotificationProvider, Dashboard)

  for (const txt of texts) {
    const element = screen.getByText(txt);  
    expect(element).toBeInTheDocument();
  }
});

test.skip("Task Graph is loading correctly",async () => {
  await renderer(MemoryRouter, NotificationProvider, Dashboard)
  VisibilityCheck("taskGraph");
})

test.skip("Navbar is loading", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Navbar);
  VisibilityCheck("navbar");
})

test.skip("TopNavbar is loading", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Topnavbar);
  VisibilityCheck("topnav");
})

test.skip("Check todos functionality", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Todos);
  for(let i=0; i<=5; i++){
    addtask("testing with jest"+i); 
  }
})

test.skip("Check todos validation - spaces", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Todos);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, {target :{value : "    "}})
  const savebtn = await screen.findByText("Save");
  expect(savebtn).toBeDisabled();
  //shouldnt allow only spaces 
})

test.skip("Check todos validation - length", async ()=>{
  renderer(MemoryRouter, NotificationProvider, Todo);
  const input = await screen.findByRole('textbox');
  fireEvent.change(input, {target : {value : "one"}});
  const savebtn = await screen.findByText('Save');
  expect(savebtn).toBeDisabled();
})

test.skip("Check todos Functionality - Edit", async ()=>{
  
  await addtaskLS("editing"); 

  const editbtn = await screen.findByTestId('Edit');
  await userEvent.click(editbtn);

  const input = await screen.findByRole('textbox');
  await expect(input.value).toBe('editing');

  fireEvent.change(input, {target : {value: "edited"}});
  
  const savebtn = await screen.findByText('Save');
  userEvent.click(savebtn);

  const editedtask = await screen.findByText('edited');
  await expect(editedtask).toBeInTheDocument();

})

test.skip("Check todos Functionality - Deletion", async ()=>{
  await addtaskLS("deletion test"); 

  const delbtn = await screen.findByTestId('Delete');
  const addedtask = await screen.findByText("deletion test");

  await userEvent.click(delbtn);
  await expect(addedtask).not.toBeInTheDocument();
})

// ls del replicant bug

test.skip("Check todos Functionality - Show Finished Tasks", async ()=>{ //sus

  //by default show finished test checked
  await addtaskLS("show finished test");

  const addedtask = await screen.findByText("show finished test");
  const taskcheckbox = screen.findByTestId("taskfinstatus");
  userEvent.click(taskcheckbox); //set finished checkbox for task

  await expect(addedtask).toBeInTheDocument(); //the task should still show since finished checkbox is ticked

  const showfinished_chkbox = await screen.findByTestId('showfinished');
  await waitFor(()=>expect(showfinished_chkbox).toBeChecked());
  await userEvent.click(showfinished_chkbox); //uncheck show finished
  await waitFor(()=>expect(showfinished_chkbox).not.toBeChecked());
  waitFor(()=>expect(addedtask).not.toBeInTheDocument()); //now the tasks should not be shown since show finished is unticked now

})

test.skip("Check Review Tasks - Tasks are being added", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Todos);
  addtask("Checking Review");
  await renderer(MemoryRouter, NotificationProvider, Review);
  const addedtasktoreview = await screen.findByText('Checking Review');
  await expect(addedtasktoreview).toBeInTheDocument();

})

//date shouldnt be before current year check for bug bozo
//bozo dont forget to mock if the component has apis n stuff, idiot

test.skip("Check Review Tasks - Setting DropDowns", async ()=>{

  await renderer(MemoryRouter, NotificationProvider, Review);
  TableSelector(0, "Low");
  TableSelector(1, "Work");
  TableSelector(2, "Educational"); //Set Attributes
  TableSelector(3, "Done");

  //Check if attributes are retained upon simulated reload(rerender)
  await renderer(MemoryRouter, NotificationProvider, Review);
  const changedpriority = await screen.findByText('Low');
  const changedorganization = await screen.findByText('Work');
  const changedcategory = await screen.findByText("Educational");
  const changedstatus = await screen.findByText("Done");
  
  await expect(changedpriority).toBeInTheDocument();
  await expect(changedorganization).toBeInTheDocument();
  await expect(changedcategory).toBeInTheDocument();
  await expect(changedstatus).toBeInTheDocument();

})

//first mock then render


test.skip("Check Review Tasks - Deletion Test", async ()=>{

  axios.get.mockResolvedValue({
    data : [
      {
        _id :'1',
        todo : "Mock",
        priority : "Medium",
        organization : "Personal",
        category : "Entertainment",
        duedate : "2025-02-05",
        status : "Ongoing",
      }
    ]
  })

  await renderer(MemoryRouter, NotificationProvider, Review);
  await waitFor(() => expect(screen.getByText('Mock')).toBeInTheDocument());
  const task = screen.getByText('Mock');
  expect(task).toBeInTheDocument();

  //first get row
  //then get cells of that row
  //then find ur element using the appropriate cell num or find it using index


  const row = screen.getAllByRole('row')[1];
  const cells = within(row).getAllByRole('cell');
  const delbtn = within(cells[6]).getByRole('button')
  console.log(delbtn.textContent);
  await userEvent.click(delbtn);
  const delconfirm = await screen.findByText('No tasks to display')
  waitFor(()=>expect(delconfirm).toBeInTheDocument());

})


test("Check Review Tasks - Date Validation Test", async ()=>{

  axios.get.mockResolvedValue({
    data : [
      {
        _id :'1',
        todo : "Mock",
        priority : "Medium",
        organization : "Personal",
        category : "Entertainment",
        duedate : "2025-02-05",
        status : "Ongoing",
      }
    ]
  })

  await renderer(MemoryRouter, NotificationProvider, Review);
  await waitFor(() => expect(screen.getByText('Mock')).toBeInTheDocument());
  const task = screen.getByText('Mock');
  expect(task).toBeInTheDocument();


  const row = screen.getAllByRole('row')[1];
  const cells = within(row).getAllByRole('cell');
  const date = within(cells[4]).getByTestId('due-date-input');

  const currentdate = new Date();
  const prevdate = new Date(currentdate);
  prevdate.setDate(currentdate.getDate()-1);
  const formatteddate = prevdate.toISOString().split('T')[0];

  await userEvent.type(date, formatteddate); // Set the new date

  // Assert the value of the date input field
  await waitFor(() => expect(date).toHaveValue(formatteddate));

})
