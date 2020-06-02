$(document).ready(function() {
  
	$('[data-toggle="tooltip"]').tooltip();

	var imageColumns = Math.round($('.product-image-manager').width() / 145);
	$('.product-image-manager').attr('data-image-columns', imageColumns);

	$('.on-image-controls > .fa-check').click(function() {
		$('.image-container').removeClass('picked-as-primary');
		$(this).parents('.image-container').addClass('picked-as-primary');
	});

	$('.on-image-controls > .fa-info-circle').click(function() {
		var image = $(this).parents('.image-container').find('img');
		var path = image.attr('src');
		var filename = path.replace(/\\/g, '/');
		filename = filename.substring(filename.lastIndexOf('/')+ 1).replace(/[?#].+$/, '');
		var extension = path.split('.').pop();
		var filesize;
		var dimensions = image.get(0).naturalWidth + ' x ' + image.get(0).naturalHeight;
		var altText = image.attr('alt');
		var title = image.attr('title');

		var xhr = new XMLHttpRequest();
		xhr.open("GET", path, true);
		xhr.responseType = "arraybuffer";
		xhr.onreadystatechange = function() {
		    if(this.readyState == this.DONE) {
		        if(this.response.byteLength >= 1000000) {
		        	var filesize = this.response.byteLength/1000000;
		        	filesize = Math.round(filesize * 10)/10 + ' MB';
		        } else {
		        	var filesize = Math.round(this.response.byteLength/1000) + ' KB';
		        }

		        $('.static-data #filesize').text(filesize);
		    }
		};
		xhr.send(null);

		$('#image-preview-modal').html('<img src="'+ path +'">');
		$('.static-data #filename').text(filename);
		//$('.static-data #file-extension').text('image/' + extension);
		$('.static-data #file-dimensions').text(dimensions);

		$('.dynamic-data #url').val(path);
		$('.dynamic-data #title').val(title);
		$('.dynamic-data #alt').val(altText);
		$('.dynamic-data #full-image-link').attr('href', path);

		$('#file-modal').modal('show');
	});

	$('.product-image-manager').sortable({
		handle: '.fa-arrows',
		helper: 'clone',
		items: '> .image-container',
		placeholder: 'image-container image-placeholder',
    tolerance: 'pointer',
		start: function(event, ui) {
        	ui.placeholder.height(ui.item.height());
        	ui.placeholder.html('<div class="inner-placeholder"></div>');
      	}
	});
  
  $('.on-image-controls > .fa-times').click(function() {
    $(this).parent().find('.delete-confirm').addClass('active');
  });
  
  $('.on-image-controls > .delete-confirm').click(function() {
    $(this).parents('.image-container').remove();
  });
  
  $('.product-image-manager > .image-container > .inner-image-container > .on-image-controls').mouseleave(function() {
    $(this).find('.delete-confirm').removeClass('active');
  });
});

$(window).load(function() {
	$('.image-container').each(function() {
		if($(this).find('img').width() > $(this).find('img').height()) {
			$(this).addClass('landscape');
		} else if($(this).find('img').width() < $(this).find('img').height()) {
			$(this).addClass('portrait');
		} else {
			$(this).addClass('square');
		}
	});
});

$(window).resize(function() {
	var imageColumns = Math.round($('.product-image-manager').width() / 145);
	$('.product-image-manager').attr('data-image-columns', imageColumns);
});