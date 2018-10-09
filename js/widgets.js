$( document ).ready( function() {

    // русская локализация datepicker
    $.datepicker.regional["ru"];

    // инициализация главного меню
    $( "#menutabs" ).tabs({
        activate: function( event, ui ) {
            Cookies.set(
                'selected-tab',
                ui.newTab.index()
            );
        },
        active: Cookies.get( 'selected-tab' ),
    }).addClass(
        "ui-tabs-vertical ui-helper-clearfix"
    ).removeClass(
        "ui-widget-content"
    );
    $( "#menutabs li.menu" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );

    // период хранения средних сидов
	$( "#avg_seeders_period, #filter_avg_seeders_period" ).spinner({
		min: 1,
		max: 30,
		mouseWheel: true
	});

	// дата релиза в настройках
	$( "#rule_date_release" ).spinner({
		min: 0,
		mouseWheel: true
    });

    /* инициализация кнопок */
	$( "button" ).button();
	$( "#select, #control, #new-torrents, #filter" ).buttonset();
	$( "#log_tabs" ).tabs();

	// фильтрация раздач, количество сидов
	$( "#rule_topics, .filter_rule input[type=text]" ).spinner({
		min: 0,
		step: 0.5,
		mouseWheel: true
	});

	// дата релиза в фильтре
	$( "#filter_date_release" ).datepicker({
		changeMonth: true,
		changeYear: true,
		showOn: "both",
		dateFormat: 'dd.mm.yy',
		maxDate: "now",
		buttonText: '<i class="fa fa-calendar" aria-hidden="true"></i>'
	}).datepicker(
        "setDate",
        $( "#filter_date_release" ).val()
    ).css(
        "width", 90
    ).datepicker(
        "refresh"
    );

	// регулировка раздач, количество пиров
	$( "#peers" ).spinner({
		min: 1,
		mouseWheel: true
	});

	// инициализация "аккордиона" для вкладки настройки
    $( "div.sub_settings" ).each( function() {
        $( this ).accordion({
            collapsible: true,
            heightStyle: "content"
        });
    });

    // выпадающее меню для отчётов
    $( "#reports_list" ).selectmenu({
        width: "calc(100% - 36px)",
        change: getReport,
        open: function( event, ui ) {
            height = $( "#reports_list-menu" ).height() >= 399 ? 400 : 'auto';
            $( "#reports_list-menu" ).css( "height", height );
            active = $( "#reports_list-button" ).attr( "aria-activedescendant" );
            $( "#reports_list-menu" ).closest( "ul" )
                .find( "div[role=option]" )
                .each( function() {
                    $( this ).css({
                        "font-weight": "normal"
                    });
                });
            $( "#" + active ).css({
                "font-weight": "bold"
            });
        },
    });

    // инициализация диалога для установки произвольной метки
    $( "#dialog" ).dialog({
        autoOpen: false,
        width: 500
    });

});
