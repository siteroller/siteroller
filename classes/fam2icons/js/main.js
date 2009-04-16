function toggle_ticket(ticket_id) {
  document.getElementById(ticket_id).toggle();
}

function selectInformAgents() {
    $$('select[name="InformUserID"] option').each(function(element){
        element.selected = true;
    });
}

function bodyOnload(){
    selectInformAgents();
}
