import React from 'react';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import { MemoryRouter } from "react-router-dom"; 
import userEvent from '@testing-library/user-event'; // Import userEvent
import Todo from '../src/components/dashboard/todo';
import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js';
require("@testing-library/jest-dom"); 
const { render, screen, waitFor, fireEvent, within } = require("@testing-library/react");
const Dashboard = require("../src/components/db").default;
const Db = require("../src/components/dashboard/dashboard").default;
const Navbar = require ("../src/components/dashboard/dashboard_navbar").default;
const Topnavbar = require("../src/components/navbar").default;
const Todos = require("../src/components/dashboard/todo").default;
const Review = require ("../src/components/dashboard/review").default;
const Chart = require ("../src/components/dashboard/chart").default;
const Kanban = require ("../src/components/dashboard/board").default;
const addmodel = require("../src/components/dashboard/ts_AddModal").default;
const Visualizer = require ("../src/components/dashboard/visualize").default;


const axios = require("axios");
const { NotificationProvider} = require("../src/components/dashboard/notificationcontext");
const { UserProvider, useUserContext } = require("../src/components/dashboard/usercontext");


jest.mock("axios"); // Mocking axios to prevent real API calls

jest.mock("chart.js", () => ({
  ...jest.requireActual("chart.js"), 
  register: jest.fn(), 
}));

jest.mock('axios');
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div>Mocked Bar Chart</div>, // Mocked Bar component
}));

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


async function addtask_kanbanboard(columnnum, title, desc, priority, deadline, tag, img=null) {

  const columnaddbtn = screen.getAllByText('Add Task')[columnnum]
  await userEvent.click(columnaddbtn);

  const titleinput = await screen.findByPlaceholderText('Title');
  fireEvent.change(titleinput, {target : {value : title}})

  const descinput = await screen.findByPlaceholderText('Description');
  fireEvent.change(descinput, {target : {value : desc}})

  const prioritycombox = await screen.findByRole('combobox');
  const priorityoption = await screen.findByRole('option', {name : priority});
  userEvent.selectOptions(prioritycombox, priorityoption)

  const time = await screen.findByDisplayValue('0')
  fireEvent.change(time, {target : {value : deadline}});

  const taginput = await screen.findByPlaceholderText('Tag Title');
  fireEvent.change(taginput, {target : {value : tag}})
  const addtagbtn = await screen.findByText('Add Tag')
  userEvent.click(addtagbtn);

  if(img){
    //handle img input
    const filebtn = await screen.findByText('Choose File')
    const file = new File([img], 'test-file.png', {type : 'img/png'})
    fireEvent.change(filebtn, {target : {files : [file]}})
    await waitFor(()=>expect(filebtn.files[0]).toBe(file))
  }

  const submitbtn = await screen.findByText('Submit Task')
  userEvent.click(submitbtn)

  await waitFor(() => {
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByText(desc)).toBeInTheDocument();
  expect(screen.getByText(priority)).toBeInTheDocument();
  expect(screen.getByText(deadline)).toBeInTheDocument();
  expect(screen.getByText(tag)).toBeInTheDocument();
  });
  
  if(img){
    await waitFor(()=>expect(screen.findByRole('img')).toBeInTheDocument());
  }
  
}

 test("Dashboard should show correct info attributes", async () => {
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

 test("Task Graph is loading correctly",async () => {
  await renderer(MemoryRouter, NotificationProvider, Dashboard)
  VisibilityCheck("taskGraph");
})

 test("Navbar is loading", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Navbar);
  VisibilityCheck("navbar");
})

 test("TopNavbar is loading", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Topnavbar);
  VisibilityCheck("topnav");
})

 test("Check todos functionality", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Todos);
  for(let i=0; i<=5; i++){
    addtask("testing with jest"+i); 
  }
})

 test("Check todos validation - spaces", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Todos);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, {target :{value : "    "}})
  const savebtn = await screen.findByText("Save");
  expect(savebtn).toBeDisabled();
  //shouldnt allow only spaces 
})

 test("Check todos validation - length", async ()=>{
  renderer(MemoryRouter, NotificationProvider, Todo);
  const input = await screen.findByRole('textbox');
  fireEvent.change(input, {target : {value : "one"}});
  const savebtn = await screen.findByText('Save');
  expect(savebtn).toBeDisabled();
})

 test("Check todos Functionality - Edit", async ()=>{
  
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

 test("Check todos Functionality - Deletion", async ()=>{
  await addtaskLS("deletion test"); 

  const delbtn = await screen.findByTestId('Delete');
  const addedtask = await screen.findByText("deletion test");

  await userEvent.click(delbtn);
  await expect(addedtask).not.toBeInTheDocument();
})

 test('Check Todos Functionality - Re-adding deleted task', async () => {
  
  addtaskLS("Bug check");
  const addedtask = await screen.findByText("Bug check");
  const delbtn = await screen.findByTestId('Delete');

  //delete tasks
  await userEvent.click(delbtn);
  await expect(addedtask).not.toBeInTheDocument();

  //re enter task with same name n check if its added
  addtaskLS("Bug check");
  await expect(addedtask).toBeInTheDocument();


})

 test("Check todos Functionality - Show Finished Tasks", async ()=>{ //sus

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

 test("Check Review Tasks - Tasks are being added", async ()=>{
  await renderer(MemoryRouter, NotificationProvider, Todos);
  addtask("Checking Review");
  await renderer(MemoryRouter, NotificationProvider, Review);
  const addedtasktoreview = await screen.findByText('Checking Review');
  await expect(addedtasktoreview).toBeInTheDocument();

})

 test("Check Review Tasks - Setting DropDowns", async ()=>{

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


 test("Check Review Tasks - Deletion Test", async ()=>{

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

  const currentdate = new Date();
  const prevdate = new Date(currentdate);
  prevdate.setMinutes(prevdate.getMinutes() - prevdate.getTimezoneOffset());
  const formatteddate = prevdate.toLocaleDateString('en-CA'); 

  axios.get.mockResolvedValue({
    data : [
      {
        _id :'1',
        todo : "Mock",
        priority : "Medium",
        organization : "Personal",
        category : "Entertainment",
        duedate : formatteddate,
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

  //use await with waitfor since its async
  await waitFor(() => {
    expect(date).not.toHaveValue(formatteddate); 
    //error message should prevent date from being set to previous 
    //already passed date
  });

})


 test('Tasks count is correctly reflected on dashboard', async () => {

  axios.get.mockResolvedValueOnce({
    data: [
      {
        _id: '1',
        todo: 'Mock Task test one',
        priority: 'High',
        organization: 'Personal',
        category: 'Work',
        duedate: '2025-02-05',
        status: 'Ongoing',
      },
    ],
  });

  await renderer(MemoryRouter, NotificationProvider, Dashboard)

  const taskHeading = await screen.findByTestId('totaltasks');
  const taskCount = await within(taskHeading).findByRole('paragraph');

  console.log(taskCount.textContent);
  expect(taskCount.textContent).toBe('1'); 
  
});

 test('Kanban Board Test - Adding tasks', async()=>{
  
  renderer(MemoryRouter, NotificationProvider, Kanban)
  for(let i =0 ; i<=4 ; i++){
  addtask_kanbanboard(i, "Fix Bug", "Resolve login issue", "High", "20", "Bug");
  }
  
})

 test('Kanban Board Test - Adding task with image', async()=>{
  
  renderer(MemoryRouter, NotificationProvider, Kanban)
  const testImageFile = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
  addtask_kanbanboard(0, "Fix Bug", "Resolve login issue", "High", "20", "Bug", testImageFile);
})

 test('Kanban Board Test - Save tasks', async()=>{
  renderer(MemoryRouter, NotificationProvider, Kanban)
  addtask_kanbanboard(1, "Fix Bug", "Resolve login issue", "High", "20", "Bug");
  const savebtn = await screen.findByText('Save Tasks')
  userEvent.click(savebtn);

  const savedinfo = ["Fix Bug", "Resolve login issue", "Bug"]
  for(let i =0 ; i<savedinfo.length ; i++){
    await waitFor(()=>expect(screen.getByText(savedinfo[i])).toBeInTheDocument())
  }

  //Simulated Reload to make sure info is retained
  renderer(MemoryRouter, NotificationProvider, Kanban)
  for(let i =0 ; i<savedinfo.length ; i++){
    await waitFor(()=>expect(screen.getByText(savedinfo[i])).toBeInTheDocument())
  }

})

 test('Kanban Board Test - Remove tasks', async()=>{
  renderer(MemoryRouter, NotificationProvider, Kanban)
  addtask_kanbanboard(1, "Fix Bug", "Resolve login issue", "High", "20", "Bug");
  const delbtn = await screen.findAllByTestId('delbtn');
  delbtn.forEach(async (btn) => await userEvent.click(btn)); 

  const savedinfo = ["Fix Bug", "Resolve login issue", "Bug"]
  for(let i =0 ; i<savedinfo.length ; i++){
    await waitFor(()=>expect(screen.queryByText(savedinfo[i])).toBeNull())
  }

  //Simulated Reload to make sure info is removed
  renderer(MemoryRouter, NotificationProvider, Kanban)
  for(let i =0 ; i<savedinfo.length ; i++){
    await waitFor(()=>expect(screen.queryByText(savedinfo[i])).toBeNull())
  }
})

 test('Kanban Board Test - Add task validation', async()=>{
  
  renderer(MemoryRouter, NotificationProvider, Kanban)

  const columnaddbtn = screen.getAllByText('Add Task')[0]
  await userEvent.click(columnaddbtn);

  const titleinput = await screen.findByPlaceholderText('Title');
  fireEvent.change(titleinput, {target : {value : '  '}})

  const descinput = await screen.findByPlaceholderText('Description');
  fireEvent.change(descinput, {target : {value : '  '}})

  const prioritycombox = await screen.findByRole('combobox');
  const priorityoption = await screen.findByRole('option', {name : 'Priority'});
  userEvent.selectOptions(prioritycombox, priorityoption)

  const time = await screen.findByDisplayValue('0')
  fireEvent.change(time, {target : {value : '-8'}});

  const taginput = await screen.findByPlaceholderText('Tag Title');
  fireEvent.change(taginput, {target : {value : '  '}})
  const addtagbtn = await screen.findByText('Add Tag')
  userEvent.click(addtagbtn);

  const submitbtn = await screen.findByText('Submit Task')
  userEvent.click(submitbtn)

  addtask_kanbanboard(0, "  ", " ", "  ", "  ", "  ");  

  await waitFor(() => {
    expect(screen.queryByText("  ")).not.toBeInTheDocument();
    expect(screen.queryByText(" ")).not.toBeInTheDocument();
    expect(screen.queryByText("-8")).not.toBeInTheDocument();

  });

})




