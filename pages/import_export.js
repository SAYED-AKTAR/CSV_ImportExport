import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import styles from '../styles/Home.module.css';


export default function ImportExport() {

    const [ieData, setIeData] = useState([]);

    const formSubmit = async (e) => {
        const formData = new FormData();
        formData.append("csvFile", document.getElementById("csvFile").files[0]);

        fetch('http://127.0.0.1:8000/import', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data['status'] === "OK") {
                    alert("Successfully imported csv data.");
                } else {
                    alert("Something went wrong, please try again !!!")
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const exportIe = async (e) => {
        // Variable to store the final csv data
        var csv_data = [];
        // Get each row data
        var rows = document.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
            // Get each column data
            var cols = rows[i].querySelectorAll('td,th');
            // Stores each csv row data
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) {

                // Get the text data of each cell
                // of a row and push it to csvrow
                csvrow.push(cols[j].innerHTML);
            }
            // Combine each column value with comma
            csv_data.push(csvrow.join(","));
        }
        // Combine each row data with new line character
        csv_data = csv_data.join('\n');
        // Call this function to download csv file 
        downloadCSVFile(csv_data);
    }

    function downloadCSVFile(csv_data) {
        // Create CSV file object and feed
        // our csv_data into it
        const CSVFile = new Blob([csv_data], {
            type: "text/csv"
        });
        // Create to temporary link to initiate
        // download process
        var temp_link = document.createElement('a');
        // Download csv file
        temp_link.download = "ExportedCSV_SAYED.csv";
        var url = window.URL.createObjectURL(CSVFile);
        temp_link.href = url;
        // This link should not be displayed
        temp_link.style.display = "none";
        document.body.appendChild(temp_link);
        // Automatically click the link to
        // trigger download
        temp_link.click();
        document.body.removeChild(temp_link);
    }

    useEffect(() => {
        fetch('http://127.0.0.1:8000/ie-user-data', {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data['status'] === "OK") {
                setIeData(data.data);
                console.log(data.data[0]['name']);
            } else {
                console.log("Something went wrong, please try again !!!")
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    }, []);

    return (
        <div className={styles.parentDiv}>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            </Head>
            <div className={styles.childDiv}>
                <div className={styles.innerForm}>
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="static" style={{ backgroundColor: "springgreen" }}>
                            <Toolbar>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color: "black" }}
                                >
                                    <i class="fa fa-car"></i> &nbsp;&nbsp;&nbsp; Import&Export &nbsp;&nbsp;&nbsp; <i class="fa fa-car"></i>
                                </Typography>
                                <Link href="/" style={{ vertical: 'top', horizontal: 'right' }}>
                                    <Button style={{ color: "black" }} variant="outlined">
                                        <i class="fa fa-solid fa-arrow-left"></i> &nbsp;&nbsp;&nbsp;Back
                                    </Button>
                                </Link>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    <Grid item xs={6} style={{ padding: "20px", marginLeft: "2%", marginTop: "3%", border: "2px solid white", width: "500px" }}>
                        <input type="file" id="csvFile" />
                        <Button onClick={formSubmit} variant="contained" color="success">Upload CSV</Button>
                    </Grid>
                </div>
                <div style={{display: "flex", textAlign: "center"}}>
                    <div>
                        {ieData.length > 0 &&
                            <div style={{ marginTop: "30px" }}>
                                <table>
                                    <thead>
                                        <th style={{ border: "2px solid black" }}>Name</th>
                                        <th style={{ border: "2px solid black" }}>Age</th>
                                        <th style={{ border: "2px solid black" }}>Email</th>
                                        <th style={{ border: "2px solid black" }}>Password</th>
                                    </thead>
                                    <tbody>
                                        {ieData.length > 0 && ieData.map((item) => {
                                            return (
                                                <tr>
                                                    <td style={{ border: "2px solid black" }}>
                                                        {item.name} 
                                                    </td>
                                                    <td style={{ border: "2px solid black", textAlign: "center" }}>
                                                        {item.age}
                                                    </td>
                                                    <td style={{ border: "2px solid black", textAlign: "center" }}>
                                                        {item.email}
                                                    </td>
                                                    <td style={{ border: "2px solid black", textAlign: "center" }}>
                                                        {item.password}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                    <Button onClick={exportIe} color="success" variant="outlined" sx={{marginTop: "30px", marginLeft: "17px",  horizontal: "right", height: "40px"}}>Export Data</Button>
                </div>
            </div>
        </div>
    );
}
