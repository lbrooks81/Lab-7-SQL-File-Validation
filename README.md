This is a simple application that allows users to upload files, either through dragging and dropping or through a dialog. 
Users are unable to upload files that have an extension other than .sql. 
The validation process involves checking to see if the file contains a SELECT statement, a FROM statement, and that it ends in a semicolon.
Users may remove files from the list whenever they like, and the error messages will be dynamically added and removed after subsequent validations.
