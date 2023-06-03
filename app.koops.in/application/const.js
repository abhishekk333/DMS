var messages = {};

// Define Your Routes
messages = {
    // Not Selected any row for inactivate
    'not_selected_heading': "Not selected any %s.",
    'not_selected_description': "You have not selected any %s to inactivate! Please select atleast one %s to inactivate.",

    // Confirmation for inactivate
    'are_you_sure_heading': "Are you sure?",
    'are_you_sure_description': "Are you sure you want to inactivate these %s.",
    'delete_are_you_sure_description': "Are you sure you want to delete these %s.",

    // Other [Success]
    'created': '%s created successfully.',
    'updated': '%s updated successfully.',
    'inactivated': '%s inactivated successfully.',
    'imported': "%s imported successfully.",
    'demo_downloaded': "demo file downloaded successfully for %s.",
    'exported': "%s exported successfully.",
    'password_changed': "Password changed successfully.",
    'report_generated': "%s report generated successfully.",
    'message_sent': "Message sent successfully.",
    'multi_print': "Multiple %s print successfully.",

    // Other [Error]
    'some_error': "Some error! Please try again.",
    'not_allowed_extension_heading': 'File type not allowed!',
    'not_allowed_extension_description': 'You have uploaded a wrong file type ! only %s files are allowed.',
    'large_file_heading': 'File is too large!',
    'large_file_description': 'File is too large! file size should be less than %s.',
    'too_many_files_heading': 'Too many files!',
    'too_many_files_description': 'You can not upload more than %s files at once.',
    'upload_failed_heading': 'Upload failed!',
    'upload_failed_description': 'File uploading is failed due to upexpected reason. please try again.',
    'select_import_file': "You have not select any file for import. Please select file for import."
};


function sprintf(format) {
    for (var i = 1; i < arguments.length; i++) {
        format = format.replace(/%s/, arguments[i]);
    }
    return format;
}