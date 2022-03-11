$(document).ready(()=>{
    let count = 1;
    let dropDownCount = 1;
    let currentEditedElementId = '';
    let dragged = '';
    $('#add-btn').on('click', (e)=>{
        e.preventDefault();
        let title = $('#title').val();
        let url = $('#url').val();        
        if(!title || !url){
            $('#message').text('All fields are required');
            return;
        }
        if(currentEditedElementId){
            let titleId = '#element-title' + currentEditedElementId;
            let urlId = '#element-url' + currentEditedElementId;
            let deleteBtnId = '#delete-btn' + currentEditedElementId;
            $(deleteBtnId).prop('disabled', false); 
            $(titleId).text(title);
            $(urlId).text(url);
            currentEditedElementId = '';
        }
        else{
            let elementId = count++;
            let element = $(`<div class="border border-dark mb-3 p-3 dropzone element" draggable='true' id="element${elementId}"><p class="element-title element-child" id="element-title${elementId}">${title}</p><p class="element-url element-child" id="element-url${elementId}"">${url}</p><button class="element-child btn btn-info me-3 mb-1 edit" id="edit-btn${elementId}">Edit</button><button class="element-child btn btn-danger mb-1 delete" id="delete-btn${elementId}">Delete</button></div>`);
            $('#left-area').append(element);
        }
        
        $('#title').val('');
        $('#url').val('');
        $('#add-btn').text('Add');
        $('#message').text('');
    });

    $('#title').blur(()=>{
        $('#message').text('');        
        if(!$('#title').val()) {
            $('#message').text('Title is required');
        }
    });

    $('#url').blur(()=>{ 
        $('#message').text('');
        if(!$('#url').val()) {
            $('#message').text('Url is required');
        } 
    });

    $('.droppable-areas').on('click', '.delete',(e)=>{        
        let id = e.target.id;
        id = '#element' + id.substring(10);
        $(id).fadeOut(500, ()=>{
            $(id).remove();
        });
    });

    $('.droppable-areas').on('click', '.edit', (e)=>{
        let id = e.target.id;
        id = id.substring(8);
        editElement(id);
    });

    function editElement(id){
        $('#add-btn').text('Edit');
        let titleId = '#element-title' + id;
        let title = $(titleId).text();
        let urlId = '#element-url' + id;
        let url = $(urlId).text();
        let deleteBtnId = '#delete-btn' + id;
        $('.delete').prop('disabled', false); 
        $(deleteBtnId).prop('disabled', true); 
        $('#title').val(title);
        $('#url').val(url);
        currentEditedElementId = id;
        window.scrollTo(0, 0);
    }

    $('.droppable-areas').on('dragstart', (e)=>{
        dragged = e.target;
        $(dragged).css('opacity', '0.5');
    });

    $('.droppable-areas').on('dragend', (e)=>{
        $(e.target).css('opacity', '1');
    });

    $('.dropzone').on('dragover', (e)=>{
        e.preventDefault();
    });

    $('.dropzone').on('drop', function(e) {
        e.preventDefault();
        if (e.target.className.includes('dropzone')) { 
            $(e.target).append(dragged);
        }
        else if($(e.target).parent().prop('className').includes('dropzone') && e.target.className.includes('element-child')){
            $(e.target).parent().append(dragged);
        }        
        $(dragged).parent().prop('className').includes('element') ? $(dragged).removeClass('dropzone') : $(dragged).addClass('dropzone');
    });

    $('#generate-nav').on('click', ()=>{
        $('#nav-container').empty();
        if($('#right-area').children().length > 0){
            let nav = `<nav class="row navbar navbar-expand-sm navbar-light bg-light"> <div class="container-fluid"> <a class="navbar-brand" href="#">Navbar</a> <div class="navbar-collapse navbar-nav"> </div> </div> </nav>`;
            $('#nav-container').append(nav);
            $('#right-area').children('div').each((i, el)=>{
                let elTitle = $(el).children('.element-title').text();
                let elUrl = $(el).children('.element-url').text();
                let navItem = '';                  
                if($(el).children('div').length > 0){ 
                    dropDownCount++;                  
                    let dropDownIdName = 'dropdown-menu' + dropDownCount;
                    let buttonIdName = 'dropdown-menu-button' + dropDownCount;
                    navItem = `<div class="dropdown">
                    <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" id="${buttonIdName}"> ${elTitle} </button> <ul class="dropdown-menu" aria-labelledby="${buttonIdName}" id="${dropDownIdName}"> </ul> </div>`;
                    $('.navbar-nav').append(navItem);  
                    $(el).children('div').each((i, subEl)=>{
                        let subElTitle = $(subEl).children('.element-title').text();
                        let subElUrl = $(subEl).children('.element-url').text();
                        let subNavItem = `<li><a class="dropdown-item" href="${subElUrl}">${subElTitle}</a></li>`;
                        let dropDownId = '#' + dropDownIdName;
                        $(dropDownId).append(subNavItem);
                    });
                }
                else{
                    navItem = `<a class="nav-link" href="${elUrl}">${elTitle}</a>`;
                    $('.navbar-nav').append(navItem);   
                }
                $('#right-area').empty();                            
            });
        }
        else{
            $('#nav-container').append('<p>There is no nav items.</p>')
        }
    });
});