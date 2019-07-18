$(document).ready(function () {

    //var userId = "753857";
    var href = window.location.href;
    var userId = href.substring(href.lastIndexOf('/') + 1);
    console.log(userId);

    var patientData;

    $.ajax({
        url: "http://localhost:3000/question/" + userId,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function(resultData) {

            patientData = resultData.data;

            //für Datenexport
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patientData));
            $("#exportButton").attr("href", dataStr);

            $.each(patientData, function(k, v){
                $("#patientDataForm input[name="+ k +"]").val(v);
            })


        },
        error : function(jqXHR, textStatus) {
            console.log(textStatus);
        },

        timeout: 120000,
    });

    $("#patientDataForm").on("submit", function(e) {
        e.preventDefault();

        var formData =  $("#patientDataForm").serializeArray();

        var patientData = {};

        $.each(formData, function(n){
            patientData[formData[n].name] = formData[n].value
        });

        patientData["id"] = userId;

        $.ajax({
            url: "http://localhost:3000/question/" + userId,
            type: "DELETE",
            contentType: 'application/json; charset=utf-8',
            success: function(resultData) {

            console.log(resultData);

                $.ajax({
                    url: "http://localhost:3000/question",
                    type: "POST",
                    data: JSON.stringify(patientData),
                    contentType: 'application/json; charset=utf-8',

                    success: function(resultData) {

                        //für Datenexport
                        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patientData));
                        $("#exportButton").attr("href", dataStr);

                        Swal.fire({
                            title: 'Erledigt!',
                            text: "Patientendaten aktualisiert.",
                            type: 'success',
                            confirmButtonText: 'Ok',
                            position: 'top',
                            onAfterClose: function(){

                            }
                        })
                    },
                    error : function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                    },

                    timeout: 120000,
                });

            },
            error : function(jqXHR, textStatus) {
                console.log(textStatus);
            },

            timeout: 120000,
        });
    });

});