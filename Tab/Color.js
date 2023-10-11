/** This contains all functions pertaining to the Colors Tab */
import { pressed } from '../Cache.js';
import { tabStates } from '../Tabs.js';

var colors = { // This object contains data for the color draggable component
	height: $('.swatches').outerHeight(),
	scheme: 'html',
	tab: 'palette',
	settings: {
	showRGB: false
	},
	searching: false,
	saved: [],
	rows: 0,
	columns: 7,
	scrolled: {
	'palette': 0
	},
	animating: false,
	updateRows: function() {
	this.rows = $('.swatches').hasClass('smallColors') ? $('.swatches span').length / this.columns / 2 - (this.columns-1) : $('.swatches span').length / this.columns - (this.columns-1);
	},
	action: function(action,ele,force) {
	if (!ele.hasClass('empty-space')) {
		var color = ele.attr('data-color');
		var colNum = $('.swatches span').index(ele);
		var location;
		if (action == 'save') {
		location = 'saved';
		} else if (action == 'tune') {
		location = 'tuner';
		} else {
		location = colors.tab;
		}
		if (location == colors.tab && !force) {
		if (ele.hasClass('deleted')) {
			this[location].splice(colNum,0,color);
			ele.removeClass('deleted');
			this.animate(ele,'palette',true);
		} else {
			var find = this[location].indexOf(color);
			this[location].splice(find,1);
			ele.addClass('deleted');
			this.animate(ele,'palette');
		}
		} else {
		if (action == 'save') {
			this.push('recent',color);
		}
		this.push(location,color);
		this.animate(ele,location);
		}
	}
	},
	selectingScheme: false,
	scroll: function(dir) {
	if (!this.selectingScheme) {
		if (!this.scrolled[this.tab]) {
		this.scrolled[this.tab] = 0;
		}
		var scrolled = this.scrolled[this.tab];
		if (dir == 'up' && !pressed.tabKey) {
		if (scrolled < 0) {
			scrolled += 1;
		}
		} else {
		if (dir == 'space') {
			scrolled -= 6;
			if (scrolled < -this.rows) {
			scrolled += -scrolled - this.rows;
			}
		} else if (dir == 'shiftSpace') {
			scrolled += 6;
			if (scrolled > 0) {
			scrolled = 0;
			}
		} else if (!pressed.tabKey) {
			if (scrolled > -this.rows) {
			scrolled -= 1;
			}
		}
		}
		this.scrolled[this.tab] = scrolled;
		if (tabStates.color.transitionScroll) {
		$('.swatches').css('transition', 'margin 0.15s ease');
		}
		$('.swatches').css('margin-top', scrolled * 32);
		setTimeout(function() {
		$('.swatches').css('transition', 'margin 0s');
		}, 150);
		var marginDrag = (this.scrolled[this.tab] - this.lastScrolled) * 32;
		if ($('.colorDragging').length && !$('.colorDragging').hasClass('shrink-out') && !$('.colorDragging').hasClass('grow-out')) {
		$('.colorDragging').css({
			'margin-top': marginDrag
		});
		if (cache.start[1] - marginDrag <= $('.category').offset().top && cache.start[1] - marginDrag >= $('.infocolor').offset().top) {
			$('.colorDragging').css({
			'opacity': 0
			});
		}
		}
	}
	},
	append: function(element) {
	var colorVal, colorName, synonyms;
	synonyms = element.split(' '); // Extracts all the color designations/names/synonyms from the string
	colorVal = synonyms[0];
	colorName = colorVal; // by default color name is just the first value (whether it's HTML name, hex, or rgb)

	if (synonyms.length > 1) { // If there is more than one color designation
		if (colorVal.charAt(0) == '#' || colorVal.startsWith('rgb(')) { // check that the first one is not a hex or rgb, otherwise replace it with a name
		colorName = synonyms[1].replace(/_/g,' '); // overwrite underscores (if there are) with spaces for the color name to display to the user
		}
	}
	
	$('.swatches').append('<span style="background:'+ colorVal +'" data-color="' + colorName + '" '+ (colorVal == '' ? 'class="empty-space"' : '') +'></span>');
	this.updateRows();
	this.cached.push(colorName);
	},
	draw: function(array) {
	this.selectingScheme = false;
	if (!array) {
		array = this.tab;
	}
	this.searching = false;
	this.updateRows();
	$('.swatches').html('');
	for (var i = 0; i < this[array].length; i++) {
		this.append(this[array][i]);
	}
	$('.swatches').css('margin-top', this.scrolled[array] * 32);
	this.tab = array;
	$('.infoPanel .tabName').html(this.tab.toUpperCase());
	},
	recent: [],
	push: function(array,color) {
	for (var i = 0; i < this[array].length; i++) {
		if (this[array][i] == color.toUpperCase()) {
		this[array].splice(i,1);
		}
	}
	this[array].unshift(color.toUpperCase());
	},
	cached :[],
	search: function(color) {
	this.scrolled[this.tab] = 0;
	color = color.toUpperCase().trim().split(',');
	this.searching = true;
	$('.infoPanel').removeClass('show');
	$('.swatches').html('');
	for (var i = 0; i < this[this.tab].length; i++) {
		for (var j = 0; j < color.length; j++) {
		if (this[this.tab][i].indexOf(color[j]) !== -1) {
			this.append(this[this.tab][i]);
		}
		}
	}
	if (this.cached.length == 0) {
		if ($('.color input.user').val().charAt(0) != '#') {
		$('.swatches').html('<div class="status">No colors named "'+color+'" found in your '+this.tab+'.</div>');
		} else {
		this.draw(this.tab);
		}
	}
	$('.swatches').css('margin-top',0);
	this.updateRows;
	if (this.cached.length == 1 && this.cached[0] == color) {
		this.draw();
		tool[property.colorTo] = color;
	}
	},
	categories: $('.colorCat'),
	schemes: $('.schemes'),
	showCategories: function() {
	this.tab = 'palette';
	$('.swatches').html('').css('margin-top', 0);
	this.categories.appendTo('.swatches');
	this.categories.css({'display': 'block'});
	this.rows = 0;
	},
	showSchemes: function() {
	colors.selectingScheme = true;
	this.tab = 'palette';
	this.schemes.addClass('view');
	},
	currentID: 0,
	animate: function(that,where,reverse) {
	this.currentID++;
	var id = this.currentID;
	var ele = $('<div class="animatable"></div>').attr('id', id).appendTo($('.animatables'));
	var to = {
		palette: $('.category span[aria-label="palette"]'),
		saved: $('.category span[aria-label="saved"]'),
		tuner: $('.category span[aria-label="tuner"]')
	}
	var goto = to[where];
	goto.addClass('animate');
	var lastCoord;
	var newAnimationPoint = (props, coordinates = lastCoord) => {
		$('.animatable#' + id).css({
		'top': coordinates[0],
		'left': coordinates[1],
		'transform': 'scale('+props.scale+')',
		'transition': 'all '+props.trans+'s ease',
		'opacity': props.opac ? props.opac : 1,
		'visibility': !props.visib ? 'visible' : 'hidden',
		'border-radius': props.border ? '50%' : '0',
		'background': that.css('backgroundColor'),
		'box-shadow': props.shadow ? '0 0 5px rgba(0,0,0,0.5)' : '0 0 5px rgba(0,0,0,0)',
		'height': props.small ? 16 : 32
		});
		lastCoord = coordinates;
	};
	if (reverse == true) {
		newAnimationPoint({scale: 0, opac: 0, trans: 0, shadow: true, border: true},[goto.offset().top,goto.offset().left + 3.5]);
		newAnimationPoint({scale: 1, opac: 1, trans: 0.5, shadow: true, border: true},[that.offset().top,that.offset().left]);
		setTimeout(function() {
		goto.removeClass('animate');
		newAnimationPoint({scale: 1, trans: 0.25, opac: 1, shadow: false, small: $('.swatches').hasClass('smallColors') ? true : false});
		}, 250);
		/*newAnimationPoint({scale: 0, trans: 0, opac: 0.5, border: true}, [goto.offset().top,goto.offset().left + 3.5]);
		newAnimationPoint({scale: 0, trans: 0.25, opac: 1, border: true, shadow: true});
		newAnimationPoint({scale: 1, trans: 0.5, opac: 1, border: true, shadow: true}, [that.offset().top,that.offset().left]);
		setTimeout(function() {
		to[where].removeClass('animate');
		newAnimationPoint({scale: 1, trans: 0.5, opac: 1, border: false, visib: false, shadow: false});
		}, 250);*/
	} else {
		newAnimationPoint({scale: 1, trans: 0, opac: 1, shadow: true, small: $('.swatches').hasClass('smallColors') ? true : false},[that.offset().top,that.offset().left]);
		newAnimationPoint({scale: 0.6, opac: 1, trans: 0.5, border: true, shadow: true},[goto.offset().top,goto.offset().left + 3.5]);
		setTimeout(function() {
		goto.removeClass('animate');
		newAnimationPoint({scale: 0, opac: 0.5, trans: 0.25, shadow: true, border: true});
		}, 250);
	}
	var obj = this;
	setTimeout(function() {
		$('.animatable#' + id).remove();
		setTimeout(function() {
		obj.animating = false;
		}, 500);
	}, 500);
	},
	picker: [],
	tuner: [],
	collections: {
	html: {
		colors: [
		// RED COLORS
		'INDIANRED COMMON_CHESTNUT', 'LIGHTCORAL LIGHT_CORAL', 'SALMON SMOKED_SALMON', 'DARKSALMON KINDLEFLAME', 'LIGHTSALMON DWARVEN_FLESH', 'CRIMSON WILD_RIDER_RED', 'RED', 'FIREBRICK', 'DARKRED SCAB_RED',
		// PINK COLORS
		'PINK', 'LIGHTPINK MATT_PINK', 'HOTPINK GIRLS_NIGHT_OUT', 'DEEPPINK SECRET_STORY', 'MEDIUMVIOLETRED MEDIUM_VIOLET_RED', 'PALEVIOLETRED PALE_VIOLET_RED',
		// ORANGE COLORS
		'CORAL', 'TOMATO BRUSCHETTA_TOMATO', 'ORANGERED RED_DIT', 'DARKORANGE SUN_CRETE', 'ORANGE',
		// YELLOW COLORS
		'GOLD', 'YELLOW', 'LIGHTYELLOW WINTER_DUVET', 'LEMONCHIFFON LEMON_CHIFFON', 'LIGHTGOLDENRODYELLOW LIGHT_GOLDENROD_YELLOW', 'PAPAYAWHIP BIOGENIC_SAND', 'MOCCASIN HOPI_MOCCASIN',
		'PEACHPUFF PEACH_PUFF', 'PALEGOLDENROD PALE_GOLDENROD', 'KHAKI CORNFLAKE', 'DARKKHAKI GOLDEN_CARTRIDGE',
		// GREEN COLORS
		'GREENYELLOW CHESTNUT_SHELL', 'CHARTREUSE RADIUM', 'LAWNGREEN NUCLEAR_WASTE', 'LIME', 'LIMEGREEN WARBOSS_GREEN', 'PALEGREEN TOXIC_FROG', 'LIGHTGREEN ULVA_LACTUCA_GREEN',
		'MEDIUMSPRINGGREEN MEDIUM_SPRING_GREEN', 'SPRINGGREEN GUPPIE_GREEN', 'MEDIUMSEAGREEN MEDIUM_SEA_GREEN', 'SEAGREEN LAKE_GREEN', 'FORESTGREEN SUMMER_FOREST_GREEN', 'GREEN HULK_GREEN', 'DARKGREEN CUCUMBER',
		'YELLOWGREEN DARK_YELLOW_GREEN', 'OLIVEDRAB SCALLION', 'OLIVE HEART_GOLD', 'DARKOLIVEGREEN DEEP_SPRING_BUD', 'MEDIUMAQUAMARINE AQUAMARIUM_BLUE', 'DARKSEAGREEN TIKI_MONSTER',
		'LIGHTSEAGREEN GLASS_JAR_BLUE', 'DARKCYAN DARK_CYAN', 'TEAL',
		// BLUE COLORS
		'AQUA', 'CYAN', 'LIGHTCYAN LIGHT_CYAN', 'PALETURQUOISE MINT_MACAROON', 'AQUAMARINE HIROSHIMA_AQUAMARINE', 'TURQUOISE FRESH_TURQUOISE', 'MEDIUMTURQUOISE MEDIUM_TURQUOISE',
		'DARKTURQUOISE JADE_DUST', 'CADETBLUE CADET_BLUE', 'STEELBLUE STEEL_BLUE', 'LIGHTSTEELBLUE LIGHT_STEEL_BLUE', 'POWDERBLUE POWDER_BLUE', 'LIGHTBLUE LIGHT_BLUE', 'SKYBLUE AFTERNOON_SKY',
		'LIGHTSKYBLUE LIGHT_SKY_BLUE', 'DEEPSKYBLUE CAPRI', 'DODGERBLUE CLEAR_CHILL', 'CORNFLOWERBLUE GUILLIMAN_BLUE', 'ROYALBLUE ROYAL_BLUE', 'BLUE',
		'MEDIUMBLUE MEDIUM_BLUE', 'DARKBLUE DARK_BLUE', 'NAVY NAVY_BLUE', 'MIDNIGHTBLUE MIDNIGHT_BLUE',
		// PURPLE COLORS
		'LAVENDER CYBER_LAVENDER', 'THISTLE', 'PLUM DAMSON_PLUM', 'VIOLET MAMIE_PINK', 'ORCHID PINK_ORCHID', 'MAGENTA', 'MEDIUMORCHID MEDIUM_ORCHID', 'MEDIUMPURPLE MATT_PURPLE',
		'REBECCAPURPLE REBECCA_PURPLE', 'BLUEVIOLET BRIGHT_BLUE_VIOLET', 'DARKVIOLET VIOLET_INK', 'DARKORCHID DARK_ORCHID', 'DARKMAGENTA DARK_MAGENTA', 'PURPLE', 'INDIGO', 'SLATEBLUE AMEIXA',
		'DARKSLATEBLUE NAUSEOUS_BLUE', 'MEDIUMSLATEBLUE MEDIUM_SLATE_BLUE',
		// BROWN COLORS
		'CORNSILK', 'BLANCHEDALMOND BLANCHED_ALMOND', 'BISQUE', 'NAVAJOWHITE NAVAJO_WHITE', 'WHEAT GRUYERE_CHEESE', 'BURLYWOOD JERBOA', 'TAN LINK_TO_THE_PAST', 'ROSYBROWN ROSE_BROWN',
		'SANDYBROWN DARK_FLESH', 'GOLDENROD CHANTERELLE', 'DARKGOLDENROD DARK_GOLDENROD', 'PERU', 'CHOCOLATE', 'SADDLEBROWN SADDLE_BROWN', 'SIENNA TEXAS_RANGER_BROWN', 'BROWN HARISSA_RED', 'MAROON',
		// WHITE COLORS
		'WHITE', 'GHOSTWHITE GHOST_WHITE', 'WHITESMOKE WHITE_SMOKE', 'FLORALWHITE FLORAL_WHITE', 'ANTIQUEWHITE MILK_TOOTH', 'SNOW', 'HONEYDEW', 'MINTCREAM MINT_CREAM', 'AZURE VAPOUR', 'ALICEBLUE ALICE_BLUE', 'SEASHELL GHOST_WHITE',
		'BEIGE HOLY_WHITE', 'OLDLACE OLD_LACE', 'IVORY', 'LINEN WHITE', 'LAVENDERBLUSH LAVENDER_BLUSH', 'MISTYROSE MISTY_ROSE',
		// GREY COLORS
		'GAINSBORO', 'LIGHTGREY PINBALL', 'SILVER', 'DARKGREY DARK_MEDIUM_GREY', 'GREY', 'DIMGREY DIM_GREY', 'LIGHTSLATEGREY LIGHT_SLATE_GREY', 'SLATEGREY CHAIN_GANG_GREY',
		'DARKSLATEGREY DARK_SLATE_GREY', 'BLACK',
		// OTHER COLORS
		//'TRANSPARENT'
		],
		ratio: [7,1],
		empty: 0
	},
	// Color naming conventions are as follows:
	// {color-blindness.com OR chir.ag OR htmlcsscolor.com} {Massive color dictionary: github/meodai/color-names} {NEAREST PANTONE COLOR NAME}
	webSafe: {
		colors: [
		'#CCFF00 ELECTRIC_LIME  SUN_GLARE',              '#CCCC00 RIO_GRANDE GOLDEN_FOIL FIREFLY',         '#CC9900 BUDDHA_GOLD VIVID_AMBER GOLDEN_YELLOW',
		'#CCFF33 GREEN_YELLOW  ACID_LIME',               '#CCCC33 EARLS_GREEN LIZARD_BELLY SULPHUR_SPRING','#CC9933 HOKEY_POKEY GOMASHIO_YELLOW NUGGET_GOLD',
		'#CCFF66 CANARY PEAR_SPRITZ SHARP_GREEN',        '#CCCC66 LASER SOFT_FERN WILD_LIME',              '#CC9966 ANTIQUE_BRASS||OAK_BUFF',
		'#CCFF99 REEF CELERY_MOUSSE SUNNY_LIME',         '#CCCC99 PINE_GLADE TIDAL_GREEN PALE_GREEN',      '#CC9999 EUNRY SILK_STONE BLUSH',
		'#CCFFCC SNOWY_MINT DISTILLED_MOSS AMBROSIA',    '#CCCCCC SILVER CEREBRAL_GREY DAWN_BLUE',         '#CC99CC LILAC LIGHT_GREYISH_MAGENTA ORCHID',
		'#CCFFFF ONAHAU DAWN_DEPARTS',                   '#CCCCFF PERIWINKLE LAVENDER_BLUE FROSTED_WINDOW','#CC99FF MAUVE LILAS CROCUS_PETAL',
		'#FFFFFF WHITE',                                 '#FFCCFF PINK_LACE SUGAR_CHIC CHERRY_BLOSSOM',    '#FF99FF LAVENDER_ROSE PINKALICIOUS COTTON_CANDY',
		'#FFFFCC CREAM CONDITIONER',                     '#FFCCCC YOUR_PINK LUSTY_GALLANT PINK_SALT',      '#FF99CC CARNATION_PINK PALE_MAGENTA_PINK COTTON_CANDY',
		'#FFFF99 PALE_CANARY SUNBURST_YELLOW',           '#FFCC99 PEACH_ORANGE||APRICOT_SHERBET',          '#FF9999 MONA_LISA LIGHT_SALMON_PINK PEACH_AMBER',
		'#FFFF66 LASER_LEMON',                           '#FFCC66 GOLDEN_TAINOI CHICKADEE PALE_MARIGOLD',  '#FF9966 ATOMIC_TANGERINE||LIVE_WIRE',
		'#FFFF33 GOLDEN_FIZZ DEEP_YELLOW LEMON_TONIC',   '#FFCC33 SUNGLOW||DANDELION',                     '#FF9933 NEON_CARROT||RADIANT_YELLOW',
		'#FFFF00 YELLOW LEMON_TONIC',                    '#FFCC00 SUPERNOVA USC_GOLD SPAGHETTI_SQUASH',    '#FF9900 ORANGE_PEEL VITAMIN_C SAFFRON',
		'#CC6600 TENN SLUDGE',                    '#CC3300 GRENADIER PLEASANT_POMEGRANATE CORAZON',       '#CC0000 GUARDSMEN_RED BOSTON_UNIVERSITY_RED FIERY_RED',
		'#CC6633 TUSCANY WINTER_SUNSET',          '#CC3333 PERSIAN_RED HIGH_RISK_RED',                    '#CC0033 MONZA||FIERCE',
		'#CC6666 CHESTNUT_ROSE FUZZY_WUZZY',      '#CC3366 HIBISCUS RASPBERRY_JAM PUCKER_UP_PINK',        '#CC0066 LIPSTICK DEEP_PINK BRIGHT_ROSE',
		'#CC6699 HOPBUSH NOCTURNAL_ROSE',         '#CC3399 MEDIUM_RED_VIOLET ROYAL_FUCHSIA ROSE_VIOLET',  '#CC0099 DARK_HOLLYWOOD_CERISE MEDIUM_VIOLET_RED DARK_RHODAMINE_RED',
		'#CC66CC FUSCHIA_PINK PURPLE_URN_ORCHID', '#CC33CC FUSCHIA_PINK_2 STEEL_PINK',                    '#CC00CC PURPLE_PIZZAZZ SCREAMING_MAGENTA ROSE_VIOLET',
		'#CC66FF HELIOTROPE JACARANDA_PINK',      '#CC33FF HELIOTROPE MAGNETOS',                          '#CC00FF ELECTRIC_VIOLET VIVID_ORCHID BODACIOUS',
		'#FF66FF PINK_FLAMINGO',                  '#FF33FF PINK_OVERFLOW',                                '#FF00FF MAGENTA_FUSCHIA MAGENTA',
		'#FF66CC HOT_PINK ROSE_PINK',             '#FF33CC RAZZLE_DAZZLE_ROSE',                           '#FF00CC PURPLE_PIZAZZ HOT_MAGENTA LIGHT_RHODAMINE_RED',
		'#FF6699 HOT_PINK FRENCH_PINK',           '#FF3399 WILD_STRAWBERRY||KNOCKOUT_PINK',               '#FF0099 PINK BIG_BANG_PINK PINK_GLO',
		'#FF6666 BITTERSWEET POMPELMO',           '#FF3366 RADICAL_RED||DIVA_PINK',                       '#FF0066 ROSE VIVID_RASPBERRY DIVA_PINK',
		'#FF6633 OUTRAGEOUS_ORANGE EXOTIC_ORANGE','#FF3333 RED_ORANGE PELATI CHERRY_TOMATO',              '#FF0033 TORCH_RED HORNET_STING',
		'#FF6600 BLAZE_ORANGE SAFETY_ORANGE',     '#FF3300 SCARLET ELECTRIC_ORANGE SWEET_\'N\'_SOUR',     '#FF0000 RED',
		'#660000 LONESTAR RED_BLOOD RED_DAHLIA',               '#663300 BAKERS_CHOCOLATE BEASTY_BROWN',  '#666600 VERDUN_GREEN EARTHY_HAKI_GREEN',
		'#660033 TYRIAN_PURPLE||CABERNET',                     '#663333 PERSIAN_PLUM DRIED_PLUM',        '#666633 COSTA_DEL_SOL DEEP_REED',
		'#660066 POMPADOUR PURPLE_DREAMER GRAPE_JUICE',        '#663366 SEANCE GRAPE',                   '#666666 DOVE_GRAY SMOKED_PEARL',
		'#660099 PURPLE INDIGO_PURPLE',                        '#663399 ROYAL_PURPLE REBECCA_PURPLE',    '#666699 KIMBERLY DARK_HORIZON',
		'#6600CC PURPLE_BLUE VIOLET_BLUE PURPLE_PACK_CHOI',    '#6633CC PURPLE_HEART SAGAT_PURPLE',      '#6666CC BLUE_MARGUERITE DARK_PERIWINKLE',
		'#6600FF ELECTRIC_INDIGO||DAZZLING_BLUE',              '#6633FF HAN_PURPLE METEOR_SHOWER',       '#6666FF DARK_CORNFLOWERBLUE BLUE_GENIE',
		'#9900FF ELECTRIC_VIOLET VIVID_PURPLE DEWBERRY',       '#9933FF BLUE_VIOLET SUGAR_GRAPE',        '#9966FF DARK_HELIOTROPE IRRIGO_PURPLE',
		'#9900CC PURPLE VIOLET_INK DAHLIA',                    '#9933CC DARK_ORCHID',                    '#9966CC AMETHYST',
		'#990099 FLIRT BURNEY_PURPLE PURPLE_CACTUS_FLOWER',    '#993399 PLUM PURPLE_INK',                '#996699 STRIKEMASTER LAVENDER_CRYSTAL',
		'#990066 FRESH_EGGPLANT 8BIT_EGGPLANT MAGENTA_LACQUER','#993366 ROUGE SCARLET_FLAME',            '#996666 COPPER_ROSE',
		'#990033 PAPRIKA PINK_RASPBERRY JESTER_RED',           '#993333 STILETTO POISONOUS_APPLE',       '#996633 POTTERS_CLAY WOODGRAIN',
		'#990000 RED_BERRY OU_CRIMSON_RED SPACE_CHERRY',       '#993300 SADDLE_BROWN CHOCOHOLIC',        '#996600 CHELSEA_GEM GAMBOGE_BROWN',
		'#669900 LIMEADE CANOPY LIME_ZEST',                    '#66CC00 LIGHT_LIMEADE DELICIOUS_DILL',   '#66FF00 BRIGHT_GREEN',
		'#669933 GREEN_APPLE THYME_AND_SALT FOLIAGE',          '#66CC33 DARK_ATLANTIS BITTER_DANDELION', '#66FF33 BRIGHT_GREEN VENEMOUS_GREEN',
		'#669966 HIGHLAND LEAFY PEPPERMINT',                   '#66CC66 LIGHT_MANTIS BERMUDAGRASS',      '#66FF66 SCREAMIN\'_GREEN',
		'#669999 PATINA DESATURATED_CYAN DUSTY_TURQUOISE',     '#66CC99 LIGHT_EMERALD VAN-GOGH-GREEN',   '#66FF99 LIGHT_SCREAMIN_GREEN THALLIUM_FLAME',
		'#6699CC DANUBE LOTHERN_BLUE ROLLING_WATERS',          '#66CCCC DARK_DOWNY ARCTIC-OCEAN',        '#66FFCC DARK_AQUAMARINE SPINDRIFT',
		'#6699FF MALIBU PUNCH_OUT_GLOVE LITTLE_BOY_BLUE',      '#66CCFF LIGHT_MALIBU HEISENBERG_BLUE',   '#66FFFF CYAN_AQUAMARINE AGGRESSIVE_BABY_BLUE',
		'#9999FF DARK_MELROSE COBALITE SERENITY',              '#99CCFF DARK_ANAKIWA APOCYAN',           '#99FFFF LIGHT_ANAKIWA GLITCHY_SHADER_BLUE',
		'#9999CC BLUE_BELL BULBELL_FROST EASTER_EGG',          '#99CCCC DARK_SINBAD PENTAGON',           '#99FFCC GREEN_AQUAMARINE LIGHT_SEA-FOAM',
		'#999999 DUSTY_GREY BASALT_GREY DRIZZLE',              '#99CC99 LIGHT_DE_YORK KETTLE_DRUM',      '#99FF99 MINT_GREEN BRIGHT_MINT',
		'#999966 LIGHT_AVOCADO RHIND_PAPYRUS FERN',            '#99CC66 DARK_WILD_WILLOW CABBAGE_PATCH', '#99FF66 LIGHT_SCREAMIN STADIUM_LAWN',
		'#999933 LIGHT_SYCAMORE GOLDEN_LIME',                  '#99CC33 ATLANTIS DARK_YELLOW_GREEN',     '#99FF33 GREEN_YELLOW LIME',
		'#999900 LIGHT_OLIVE PEA_SOUP GOLDEN_LIME',      '#99CC00 LIGHT_PISTACHIO VIRIC_GREEN',      '#99FF00 CHARTREUSE GREENDAY',
		'#00FF00 LIME_GREEN',                            '#00CC00 DARK_LIME DEMETER_GREEN',          '#009900 LIGHT_PIGMENT ISLAMIC_GREEN',
		'#00FF33 FREE_SPEECH_GREEN LEXALOFFLE_GREEN',    '#00CC33 DARK_PASTEL_GREEN VIVID_MALACHITE','#009933 PIGMENT_GREEN PIXELATED_GRASS',
		'#00FF66 LIGHT_SPRING_GREEN BOOGER_BUSTER',      '#00CC66 JADE GREEN_ELLIOTT',               '#009966 SHAMROCK_GREEN GREEN_CYAN',
		'#00FF99 MEDIUM_SPRING_GREEN GREEN_GAS',         '#00CC99 CARIBBEAN_GREEN',                  '#009999 PERSIAN_GREEN REGULA_BARBARA_BLUE',
		'#00FFCC BRIGHT_TEAL',                           '#00CCCC ROBIN\'S_EGG_BLUE',                '#0099CC PACIFIC_BLUE TOMB_BLUE',
		'#00FFFF CYAN_AQUA AQUA',                        '#00CCFF DEEP_SKY_BLUE VIVID_SKY_BLUE',     '#0099FF DODGER_BLUE SKY_OF_MAGRITTE',
		'#33FFFF LIGHT_CYAN_AQUA BRIGHT_CYAN',          '#33CCFF DEEP_SKY_BLUE MEGAMAN',            '#3399FF DARK_DODGER_BLUE BRILLIANT_AZURE',
		'#33FFCC GREENISH_CYAN',                         '#33CCCC DARK_TURQUOISE TURQUOISE_PANIC',   '#3399CC SUMMER_SKY SORCERER',
		'#33FF99 EVA_GREEN',                             '#33CC99 SHAMROCK DARK_SHAMROCK',           '#339999 JAVA AQUA_LAKE',
		'#33FF66 DARK_SCREAMIN_GREEN BRIGHT_LIGHT_GREEN','#33CC66 LIGHT_EMERALD UFO_GREEN',          '#339966 EUCALYPTUS',
		'#33FF33 HARLEQUIN HOT_GREEN',                   '#33CC33 LIME_GREEN WARBOSS_GREEN',         '#339933 FOREST_GREEN PUTTING_GREEN',
		'#33FF00 LIGHT_HARLEQUIN PLUTONIUM',             '#33CC00 DARK_HARLEQUIN APPLE_II_LIME',     '#339900 LA_PALMA GRASSY_GREEN',
		'#006600 GREEN PAKISTAN_GREEN',                  '#003300 DARK_MYRTLE SERPENTINE_SHADOW',  '#000000 BLACK',
		'#006633 WATERCOURSE DARK_ELF_GREEN',            '#003333 DARK_CYPRUS NORA\'S FOREST',     '#000033 MIDNIGHT_EXPRESS ABYSSOPELAGIC_WATER',
		'#006666 BLUE_STONE SCIFI_PETROL',               '#003366 MIDNIGHT_BLUE PRUSSIAN_BLUE',    '#000066 NAVY ALONE_IN_THE_DARK',
		'#006699 BAHAMA_BLUE ATLANTIC_MYSTIQUE',         '#003399 SMALT',                          '#000099 NEW_MIDNIGHT_BLUE DUKE_BLUE',
		'#0066CC SCIENCE_BLUE ROYAL_NAVY_BLUE',          '#0033CC PERSIAN_BLUE ARCADE_GLOW',       '#0000CC DARK_BLUE LADY_OF_THE_SEA',
		'#0066FF *BLUE_RIBBON',                          '#0033FF BLUE BLINKING_BLUE',             '#0000FF BLUE',
		'#3366FF ROYAL_BLUE GENTIAN_FLOWER',             '#3333FF DARK_NEON_BLUE LIGHT_ROYAL_BLUE','#3300FF LIGHTER_BLUE ELECTRIC_ULTRAMARINE',
		'#3366CC MARINER CELTIC_BLUE',                   '#3333CC CERULEAN_BLUE',                  '#3300CC MEDIUM_BLUE INTERDIMENSIONAL_BLUE',
		'#336699 LOCHMARA SUMMERDAY_BLUE',               '#333399 BLUEBELL',                       '#330099 PERSIAN_INDIGO VIOLET_HICKEY',
		'#336666 TAX_BREAK DEEP_MARINE',                 '#333366 DEEP_KOAMARU',                   '#330066 CHRISTALLE DEEP_VIOLET',
		'#336633 SAN_FELIX GAMEBOY_SHADE',               '#333333 NIGHT_RIDER CARBON',             '#330033 DARK_BAROSSA EXQUISITE_EGGPLANT',
		'#336600 VERDUN_GREEN TATZELWURM_GREEN',         '#333300 KARAKA WASABI_NORI',             '#330000 DARK_TEMPTRESS OLD_BROWN_CANYON',
		'rgb(7,7,7)'   ,   'rgb(91,91,91)',   'rgb(178,178,178)',
		'rgb(14,14,14)',   'rgb(98,98,98)',   'rgb(185,185,185)',
		'rgb(21,21,21)',   'rgb(105,105,105)','rgb(192,192,192)',
		'rgb(28,28,28)',   'rgb(112,112,112)','rgb(199,199,199)',
		'rgb(35,35,35)',   'rgb(119,119,119)','rgb(206,206,206)',
		'rgb(42,42,42)',   'rgb(126,126,126)','rgb(213,213,213)',
		'rgb(49,49,49)',   'rgb(135,135,135)','rgb(220,220,220)',
		'rgb(56,56,56)',   'rgb(143,143,143)','rgb(227,227,227)',
		'rgb(63,63,63)',   'rgb(150,150,150)','rgb(234,234,234)',
		'rgb(70,70,70)',   'rgb(157,157,157)','rgb(241,241,241)',
		'rgb(77,77,77)',   'rgb(164,164,164)','rgb(248,248,248)',
		'rgb(84,84,84)',   'rgb(171,171,171)','rgb(255,255,255)'
		],
		ratio: [3,12],
		empty: 0
	},
	flat: {
		colors: [
		'#f9ebea TUTU PRINCESS_ELLE',           '#fdedec CHABLIS WHITE_GLOSS',          '#f5eef8 BLUE_CHALK',     '#f4ecf7 PERFUME_HAZE',       '#eaf2f8 INSIGNIA_WHITE',  '#ebf5fb MOON_WHITE','#e8f8f5 GREEN',
		'#f2d7d5 VANILLA_ICE FRENCH_BUSTLE',    '#fadbd8 PALE_PINK PINK_LOTUS',         '#ebdef0 DIVINE_DOVE',    '#e8daef POUTY_PURPLE',       '#d4e6f1 PATTENS_BLUE',    '#d6eaf8 CLOUDLESS','#d1f2eb GREEN',
		'#e6b0aa SHILO',                        '#f5b7b1 CUPID BALLERINA_TEARS',        '#d7bde2 PLUM_POINT',     '#d2b4de PRETTY_PETUNIA',     '#a9cce3 TEMPLATE',        '#aed6f1 BLUE_RICE','#a3e4d7 GREEN',
		'#d98880 RED_PINK MY_PINK',             '#f1948a SWEET_PINK PALE_PLUM_BLOSSOM', '#c39bd3 MAUVE_MIST',     '#bb8fce PALE_PURPLE',        '#7fb3d5 BLUE_CUDDLE',     '#85c1e9 WASURENAGUSA_BLUE','#76d7c4 GREEN',
		'#cd6155 INDIAN_RED SUNGLO',            '#ec7063 BURNT_SIENNA PORCELAIN_ROSE',  '#af7ac5 WISTERIA',       '#a569bd SOFT_PURPLE',        '#5499c7 BLUE_IGUANA',     '#5dade2 WINDJAMMER','#48c9b0 GREEN',
		'#c0392b PERSIAN_RED CADILLAC_COUPE',   '#e74c3c CINNABAR CARMINE_PINK',        '#9b59b6 DEEP_LILAC',     '#8e44ad MOONSHADOW',         '#2980b9 AMALFI_COAST',    '#3498db DAYFLOWER','#1abc9c GREEN',
		'#a93226 BROWN FRESH_AUBURN',           '#cb4335 MAHOGANY REBEL_RED',           '#884ea0 VICIOUS_VIOLET', '#7d3c98 CADMIUM_VIOLET',     '#2471a3 BLUES',           '#2e86c1 CHRISTMAS_BLUE','#17a589 GREEN',
		'#922b21 MANDARIAN_ORANGE VIVID_AUBURN','#b03a2e MEDIUM_CARMINE MOLTEN_LAVA',   '#76448a NIGHTLY_VIOLET', '#6c3483 MAXIMUM_PURPLE',     '#1f618d DEEP_WATER',      '#2874a6 TAIWAN_BLUE_MAGPIE','#148f77 GREEN',
		'#7b241c FALU_RED RED_DAHLIA',          '#943126 BURNT_UMBER BENGARA_RED',      '#633974 PLUM_JAM',       '#5b2c6f PURPLE IMPERIAL',           '#1a5276 BLUE CANOE_BLUE',      '#21618c BLUE DEEP_WATER' ,'#117864 GREEN',
		'#641e16 RED_OXIDE CHERRYWOOD',         '#78281f RED_BERRY HIHADA_BROWN',       '#512e5f IMPERIAL_PURPLE','#4a235a PURPLE ACAI',               '#154360 BLUE NEPTUNE\'S_WRATH','#1b4f72 BLUE CANOE_BLUE','#0e6251 GREEN',
		'#e8f6f3 GREEN',        '#e9f7ef GREEN',       '#eafaf1 GREEN',         '#fef9e7 MERINGUE',    '#fef5e7 MERINGUE',     '#fdf2e9 MERINGUE',    '#fbeee6 SILENCE',
		'#d0ece7 GREEN',        '#d4efdf AQUA_GLASS',  '#d5f5e3 HINT_OF_MINT',  '#fcf3cf YELLOW',      '#fdebd0 AFTERGLOW',    '#fae5d3 CREAM_PINK',  '#f6ddcc VANILLA_CREAM',
		'#a2d9ce YUCCA',        '#a9dfbf GREEN',       '#abebc6 BROOK_GREEN',   '#f9e79f YELLOW',      '#fad7a0 ORANGE',       '#f5cba7 ALMOND_CREAM','#edbb99 ORANGE',
		'#73c6b6 CASCADE',      '#7dcea0 GREEN',       '#82e0aa GREEN',         '#f7dc6f GOLDFINCH',   '#f8c471 SUNSET_GOLD',  '#f0b27a ORANGE',      '#e59866 KRILL',
		'#45b39d WATERFALL',    '#52be80 IRISH_GREEN', '#58d68d SPRING_BOUQUET','#f4d03f YELLOW',      '#f5b041 ORANGE',       '#eb984e ORANGE',      '#dc7633 ORANGE_OCHRE',
		'#16a085 SEA_GREEN',    '#27ae60 ISLAND_GREEN','#2ecc71 GREEN',         '#f1c40f LEMON',       '#f39c12 ZINNIA',       '#e67e22 ORANGE',      '#d35400 JACK_O_LANTERN',
		'#138d75 VIRIDIS',      '#229954 GREEN',       '#28b463 ISLAND_GREEN',  '#d4ac0d ',            '#d68910 DARK_CHEDDAR', '#ca6f1e ORANGE BROWN','#ba4a00 ORANGE BROWN',
		'#117a65 CADMIUM GREEN','#1e8449 WATER_NYMPH', '#239b56 GREEN',         '#b7950b ',            '#b9770e ',             '#af601a HONEY_GINGER','#a04000 ORANGE BROWN',
		'#0e6655 VERDANT_GREEN','#196f3d GREEN',       '#1d8348 WATER_NYMPH',   '#9a7d0a YELLOW BROWN','#9c640c PUMPKIN_SPICE','#935116 ORANGE BROWN','#873600 ORANGE BROWN',
		'#0b5345 EVERGREEN',    '#145a32 GREEN',       '#186a3b GREEN',         '#7d6608 YELLOW BROWN','#7e5109 ORANGE BROWN', '#784212 ORANGE BROWN','#6e2c00 ORANGE BROWN',
		'#fdfefe GREY',           '#f8f9f9 GREY',             '#f4f6f6 BRIGHT_WHITE','#f2f4f4 BRIGHT_WHITE','#ebedef GREY',             '#eaecee GREY',' ',
		'#fbfcfc GREY',           '#f2f3f4 GREY',             '#eaeded GREY',        '#e5e8e8 BIT_OF_BLUE', '#d6dbdf ANTIQUE_CRINOLINE','#d5d8dc GREY',' ',
		'#f7f9f9 GREY',           '#e5e7e9 BIT_OF_BLUE',      '#d5dbdb BLUE_BLUSH',  '#ccd1d1 COOL_GRAY',   '#aeb6bf PEARL_BLUE',       '#abb2b9 GREY',' ',
		'#f4f6f7 BRIGHT_WHITE',   '#d7dbdd ANTIQUE_CRINOLINE','#bfc9ca MISTY_BLUE',  '#b2babb METAL',       '#85929e TRADEWINDS',       '#808b96 GREY',' ',
		'#f0f3f4 BRILLIANT_WHITE','#cacfd2 ICE_FLOW',         '#aab7b8 GREY',        '#99a3a4 QUARRY',      '#5d6d7e BLUE_MIRAGE',      '#566573 GREY',' ',
		'#ecf0f1 BRILLIANT_WHITE','#bdc3c7 SKY_GRAY',         '#95a5a6 QUARRY',      '#7f8c8d GREY',        '#34495e DARK_DENIM',       '#2c3e50 GREY',' ',
		'#d0d3d4 GROUT',          '#a6acaf PURITAN_GRAY',     '#839192 GREEN MILIEU','#707b7c GREY',        '#2e4053 BLUE_WING_TEAL',   '#273746 GREY',' ',
		'#b3b6b7 ICE_PALACE',     '#909497 CONCRETE',         '#717d7e GREY',        '#616a6b GREY',        '#283747 DRESS_BLUES',      '#212f3d GREY',' ',
		'#979a9a LIMESTONE',      '#797d7f THUNDERCLOUD',     '#5f6a6a GREY',        '#515a5a URBAN_CHIC',  '#212f3c CARBON',           '#1c2833 GREY',' ',
		'#7b7d7d THUNDERCLOUD',   '#626567 COOL_GRAY',        '#4d5656 DARK_SHADOW', '#424949 DEEP_FOREST', '#1b2631 GREY',             '#17202a GREY',' '
		],
		ratio: [7,10],
		empty: 10
	},
	material: {
		colors: [
		'#ffebee JUST_PINK_ENOUGH','#fce4ec SPUN_SUGAR',      '#f3e5f5 SOFT_LAVENDER',
		'#ffcdd2 SWEET_SIXTEEN',   '#f8bbd0 LITTLE_BABY_GIRL','#e1bee7 PROM_CORSAGE',
		'#ef9a9a RIVER_ROUGE',     '#f48fb1 SACHET_PINK',     '#ce93d8 BLUSH_ESSENCE',
		'#e57373 FROLY',           '#f06292 MEDIUM_PINK',     '#ba68c8 PURPLE_URN_ORCHID',
		'#ef5350 AMOUR',           '#ec407a CERISE_PINK',     '#ab47bc ULTRAVIOLET_CRYNER',
		'#f44336 VERMILION_BIRD',  '#e91e63 MELLOW_MELON',    '#9c27b0 PINK_SYPRO',
		'#e53935 ROSE_MADDER',     '#d81b60 DOGWOOD_ROSE',    '#8e24aa PALE_GREY_SHADE_WASH',
		'#d32f2f CHI-GONG',        '#c2185b BRIGHT_ROSE',     '#7b1fa2 NOBLE_CAUSE_PERFECT',
		'#c62828 AKABENI',         '#ad1457 PLUM_PERFECT',    '#6a1b9a CHINESE_PURPLE',
		'#b71c1c CARNELIAN',       '#880e4f FRENCH_PLUM',     '#4a148c AMERICAN_VIOLET',
		'#ede7f6 BRIGHT_DUSK',        '#e8eaf6 COCONUT_WHITE',          '#e3f2fd BLUE','#e1f5fe BLUE',
		'#d1c4e9 FOGGY_LOVE',         '#c5cae9 ACE',                    '#bbdefb BLUE','#b3e5fc BLUE',
		'#b39ddb LIGHT_PASTEL_PURPLE','#9fa8da WHIPPED_VIOLET',         '#90caf9 BLUE','#81d4fa BLUE',
		'#9575cd TRUE_V',             '#7986cb TWILIGHT_TWINKLE',       '#64b5f6 BLUE','#4fc3f7 BLUE',
		'#7e57c2 FUCHSIA_BLUE',       '#5c6bc0 BLUISH_PURPLE_ANEMONE',  '#42a5f5 BLUE','#29b6f6 BLUE',
		'#673ab7 PURPLE_SPOT',        '#3f51b5 BLUE_VIOLET',            '#2196f3 BLUE','#03a9f4 BLUE',
		'#5e35b1 SWISS_PLUM',         '#3949ab BLUE',                   '#1e88e5 BLUE','#039be5 BLUE',
		'#512da8 MEGADRIVE_SCREEN',   '#303f9f BLUEBELL',               '#1976d2 BLUE','#0288d1 BLUE',
		'#4527a0 PURPLE_CABBAGE',     '#283593 ULTRAMARINE_HIGHLIGHT',  '#1565c0 BLUE','#0277bd BLUE',
		'#311b92 PIXIE_POWDER',       '#1a237e IMPRESSION_OF_OBSCURITY','#0d47a1 BLUE','#01579b BLUE',
		'#e1f5fe BLUE','#e0f7fa BLUE','#e0f2f1 GREEN','#e8f5e9 GREEN','#f1f8e9 GREEN','#f9fbe7 GREEN','#fffde7 YELLOW',
		'#b3e5fc BLUE','#b2ebf2 BLUE','#b2dfdb GREEN','#c8e6c9 GREEN','#dcedc8 GREEN','#f0f4c3 GREEN','#fff9c4 YELLOW',
		'#81d4fa BLUE','#80deea BLUE','#80cbc4 GREEN','#a5d6a7 GREEN','#c5e1a5 GREEN','#e6ee9c GREEN','#fff59d YELLOW',
		'#4fc3f7 BLUE','#4dd0e1 BLUE','#4db6ac GREEN','#81c784 GREEN','#aed581 GREEN','#dce775 GREEN','#fff176 YELLOW',
		'#29b6f6 BLUE','#26c6da BLUE','#26a69a GREEN','#66bb6a GREEN','#9ccc65 GREEN','#d4e157 GREEN','#ffee58 YELLOW',
		'#03a9f4 BLUE','#00bcd4 BLUE','#009688 GREEN','#4caf50 GREEN','#8bc34a GREEN','#cddc39 GREEN','#ffeb3b YELLOW',
		'#039be5 BLUE','#00acc1 BLUE','#00897b GREEN','#43a047 GREEN','#7cb342 GREEN','#c0ca33 GREEN','#fdd835 YELLOW',
		'#0288d1 BLUE','#0097a7 BLUE','#00796b GREEN','#388e3c GREEN','#689f38 GREEN','#afb42b GREEN','#fbc02d YELLOW',
		'#0277bd BLUE','#00838f BLUE','#00695c GREEN','#2e7d32 GREEN','#558b2f GREEN','#9e9d24 GREEN','#f9a825 YELLOW',
		'#01579b BLUE','#006064 BLUE','#004d40 GREEN','#1b5e20 GREEN','#33691e GREEN','#827717 GREEN','#f57f17 YELLOW',
		'#fff8e1','#fff3e0','#fbe9e7','#efebe9','#fafafa','#eceff1','#ffffff',
		'#ffecb3','#ffe0b2','#ffccbc','#d7ccc8','#f5f5f5','#cfd8dc','#000000',
		'#ffe082','#ffcc80','#ffab91','#bcaaa4','#eeeeee','#b0bec5','#ff8a80',
		'#ffd54f','#ffb74d','#ff8a65','#a1887f','#e0e0e0','#90a4ae','#ff5252',
		'#ffca28','#ffa726','#ff7043','#8d6e63','#bdbdbd','#78909c','#ff1744',
		'#ffc107','#ff9800','#ff5722','#795548','#9e9e9e','#607d8b','#d50000',
		'#ffb300','#fb8c00','#f4511e','#6d4c41','#757575','#546e7a','#ff80ab',
		'#ffa000','#f57c00','#e64a19','#5d4037','#616161','#455a64','#ff4081',
		'#ff8f00','#ef6c00','#d84315','#4e342e','#424242','#37474f','#f50057',
		'#ff6f00','#e65100','#bf360c','#3e2723','#212121','#263238','#c51162',
		'#ea80fc','#b388ff','#8c9eff','#82b1ff','#80d8ff','#84ffff','#a7ffeb',
		'#e040fb','#7c4dff','#536dfe','#448aff','#40c4ff','#18ffff','#64ffda',
		'#d500f9','#651fff','#3d5afe','#2979ff','#00b0ff','#00e5ff','#1de9b6',
		'#aa00ff','#6200ea','#304ffe','#2962ff','#0091ea','#00b8d4','#00bfa5',
		'#b9f6ca','#ccff90','#f4ff81','#ffff8d','#ffe57f','#ffd180','#ff9e80',
		'#69f0ae','#b2ff59','#eeff41','#ffff00','#ffd740','#ffab40','#ff6e40',
		'#00e676','#76ff03','#c6ff00','#ffea00','#ffc400','#ff9100','#ff3d00',
		'#00c853','#64dd17','#aeea00','#ffd600','#ffab00','#ff6d00','#dd2c00'
		],
		ratio: [7,10],
		empty: 0
	},
	sundberg: {
		colors: [
		'#FFFFFF WHITE',                '#F5F7ED PEARL COOL_DECEMBER',  '#FDFAF2 ALABASTER WHITE_DESERT','#F7FEFD SNOW DEUTZIA_WHITE','#FCF6E6 IVORY ANTIQUE_CHINA',
		'#FEFADD CREAM BAVARIAN_CREAM', '#FDF9E5 EGG_SHELL LEAD_GLASS', '#FBFCF7 COTTON COOL_DECEMBER',  '#FAFAF3 CHIFFON UNBLEACHED','#F6EFEC SALT HINT_OF_RED',
		'#F9F3EC LACE RISOTTO',         '#FDF1E7 COCONUT PICO_IVORY',   '#F1EAD5 LINEN EGGSHELL',        '#E6DFCE BONE PUEBLO_WHITE', '#FFF9ED DAISY',
		'#F3F4EF POWDER CLASSIC_CHALK', '#EFFBFC FROST DISTANT_HORIZON','#FFFEFC PORCELAIN WHITEWASH',   '#FAF5E1 PARCHMENT DIAMOND', '#F9F5F0 RICE MILK_GLASS',

		'#E4DCB2 TAN STAR_BRIGHT',      '#EADEA2 BEIGE BREATH_OF_SPRING','#F4E185 MACAROON HALAKA_PILA',     '#C7BC93 HAZEL_WOOD BALSA_STONE',        '#D1B868 GRANOLA WAX_WAY',
		'#DBCA92 OAT SONOMA_CHARDONNAY','#F6E3A5 EGG_NOG BLENDED_FRUIT', '#C3AA5F FAWN LASER',               '#F2EBB4 SUGAR_COOKIE CREME_DE_LA_CREME','#D3BA6F SAND SWEET_MUSTARD',
		'#DCB981 SEPIA HONEY_BUNNY',    '#E3C385 LATTE NEW_ORLEANS',     '#DBD7A6 OYSTER GARDEN_GLADE',      '#DFC673 BISCOTTI CHENIN',               '#FAEA9D PARMESAN DROVER',
		'#B9A667 HAZELNUT GYPSY_CANVAS','#D6C385 SANDCASTLE SOUR_APPLE', '#FBF0B9 BUTTERMILK DANDELION_WINE','#ECE9BE SAND_DOLLAR WHITE_ASPARAGUS',   '#F8E89B SHORTBREAD SUMMERS_HEAT',

		'#F9E668 YELLOW VANILLA_PUDDING','#F1CA44 CANARY CRUSHED_PINEAPPLE','#EDA93B GOLD ACORN_SQUASH',     '#FBEE95 DAFFODIL CALABASH',    '#D1B868 FLAXEN WAX_WAY',
		'#F9E355 BUTTER PARIS_DAISY',    '#F1FC79 LEMON HUANG_DI_YELLOW',   '#E0BA4A MUSTARD CAPITAL_YELLOW','#E0CD45 CORN CONFETTI',        '#DBB33D MEDALLION WOVEN_GOLD',
		'#F5CF51 DANDELION MAIZE',       '#F0A93E FIRE ACORN_SQUASH',       '#F7E34C BUMBLEBEE GOLDEN_STICH','#FBF4AD BANANA GOLDEN_STICH',  '#F0BF42 BUTTERSCOTCH SHARP_YELLOW',
		'#BA9430 DIJON HOKEY_POKEY',     '#F5C545 HONEY EYELASH_VIPER',     '#FAEB86 BLONDE CITRUS_PUNCH',   '#F9E355 PINEAPPLE PARIS_DAISY','#F5D252 TUSCAN_SUN MAIZE',

		'#DD7733 ORANGE ORANGE_OCHRE','#E98840 TANGERINE FLAMENCO',    '#F1B145 MERIGOLD ARTISANS-GOLD', '#AB6B35 CIDER TANOOKI_SUIT-BROWN','#834518 RUST RUSSET',
		'#AF5C22 GINGER SIENNA',      '#EA742E TIGER VIVID_TANGELO',   '#CD5F30 FIRE CHILEAN_FIRE',      '#A75B24 BRONZE BRIGHT_BRONZE',    '#EFA57A CANTALOUPE CORAL_SILK',
		'#DE8734 APRICOT SUNLOUNGE',  '#77441A CLAY WALNUT',           '#E09B37 HONEY LION-KING',        '#DD7834 CARROT ORANGE_OCHRE',     '#BB6327 SQUASH RUDDY_BROWN',
		'#723C14 SPICE SEPIA',        '#C26727 MARMALADE KINCHA-BROWN','#7F3614 AMBER BEER-GLAZED-BACON','#C8763B SANDSTONE ZEST',          '#A34F1B YAM ANCIENT_BRONZE',

		'#BF3F36 RED NAUGHTY_HOTTIE','#8D2113 CHERRY ULURU_RED',        '#CF3A36 ROSE REBEL_RED',    '#581711 JAM PHILIPPINE_BROWN','#4E221D MERLOT TOBI_BROWN',
		'#58140B GARNET EARTH_BROWN','#A9271C CRIMSON FRESH_AUBURN',    '#841B11 RUBY FALU_RED',     '#851E15 SCARLET FALU_RED',    '#450F09 WINE BLACK_CHOCOLATE',
		'#752E1A BRICK HIHADA_BROWN','#9B381D APPLE DEEP_DUMPLING',     '#9C2A1B MAHOGANY RED_BIRCH','#3C110C BLOOD DARK-SIENNA',   '#68180D SANGRIA CHERRYWOOD',
		'#6F2119 BERRY PERSIAN_PLUM','#5E160E CURRANT PHILIPPINE-BROWN','#B05A4E BLUSH GIANTS_CLUB', '#C02F1D CANDY POINCIANA',     '#A51200 LIPSTICK KID_ICARUS',

		'#E99ECB PINK CREPE_MYRTLE',    '#EE99AD ROSE PIGGY',                 '#E955A7 FUSCIA RASPBERRY_PINK','#E05E79 PUNCH BLUSH_D\'AMOUR',     '#F5C8E3 BLUSH SPARKLING_PINK',
		'#EE869D WATERMELON POSY_PETAL','#F1A8B8 FLAMINGO ROZOWYI_PINK',      '#E2738C ROUGE DEEP_BLUSH',     '#F1AEA2 SALMON FIRST_DATE',        '#ED846F CORAL THUNDELARRA',
		'#ED9988 PEACH WHIMSY',         '#E85A55 STRAWBERRY AMOUR',           '#954845 ROSEWOOD ASHEN_BROWN', '#F1BECB LEMONADE AMAYA',           '#EB8CC2 TAFFY BLUSHED_BOMBSHELL',
		'#EB67A6 BUBBLEGUM AMARANTH',   '#E99EBE BALLET_SLIPPER BEGONIA_PINK','#E9BAC6 CREPE CHANTILLY',      '#CF3382 MAGENTA HIGHLIGHTER_LILAC','#EB3993 HOT_PINK CERISE_PINK',

		'#9635BD PURPLE AKEBI_PURPLE',        '#734D84 MAUVE AFFAIR',         '#67128E VIOLET EXTRAVIOLET', '#5A1035 BOYSENBERRY BROWN_CHOCOLATE','#D9A2F1 LAVENDER PETAL_PUSH',
		'#582036 PLUM LIGHT_CHOCOLATE_COSMOS','#941E58 MAGENTA WINE_GRAPE',   '#AA64C7 LILAE RICH_LAVENDER','#5F3346 GRAPE MAUVE_WINE',           '#B695CF PERIWINKLE PALE_PURPLE',
		'#471528 SANGRIA BLACKBERRY',         '#2D1530 EGGPLANT BLACKCURRANT','#5D112D JAM BROWN_CHOCOLATE','#9068BF IRIS VIOLA',                 '#967DB4 HEATHER LAVENDER_PURPLE',
		'#9B61DE AMETHYST DARK_PASTEL_PURPLE','#250B16 RASIN MESKI_BLACK',    '#A66CE7 ORCHID LAVENDER',    '#450820 MULBERRY CHOCOLATE_KISS',    '#280819 WINE MESKI_BLACK',

		'#3C43B3 BLUE EARLY_SPRING_NIGHT','#767B86 SLATE BAY_WHARF',   '#7CC3D7 SKY BLUE_CHARM',      '#0C116C NAVY DARK_ROYAL_BLUE','#271E59 INDIGO DEEP_BREATH',
		'#1D37B6 COBALT PERSIAN_BLUE',    '#63A8AC TEAL NIRVANA_JEWEL','#285F63 OCEAN DEEP_SEA_DIVER','#102C35 PEACOCK STORM_GREEN', '#181F9F AZURE DEEP_SAPPHIRE',
		'#4190BE CERULEAN QUIET_NIGHT',   '#2932BA LAPIS PERSIAN_BLUE','#303E4B SPRUCE DARK_SPELL',   '#5F788B STONE NIGHT_OWL',     '#28446B AEGEAN NIGHTLIFE',
		'#28446B BERRY NIGHTLIFE',        '#161D3B DENIM KON',         '#08108E ADMIRAL YEARNING',    '#6CB0BE SAPPHIRE WATER_MUSIC','#9CEBFA ARCTIC PERMAFROST',

		'#5FAF52 GREEN SHISO_GREEN',   '#C1FA5F CHARTREUSE PEAR_SPRITZ','#3F531D JUNIPER VERDUN_GREEN',       '#778B6C SAGE WATERCROSS-SPICE','#BDF171 LIME PISCO_SOUR',
		'#75BA6D FERN PRIMO',          '#A0BE6F OLIVINE',               '#3C872A EMERALD LA_PALMA',           '#83B446 PEAR SPRING-SPROUT',   '#4F6C2B MOSS GREEN_LEAF',
		'#4DA935 SHAMROCK BALLYHOO',   '#77E99E SEAFOAM AURORA_GREEN',  '#2E4E24 PINE PALM_LEAF',             '#57BD59 PARAKEET FOREST-MAID', '#ABEBC6 MINT MARTIAN_HAZE',
		'#394926 SEAWEED DEEP_SEAWEED','#617C3F PICKLE MONGROVE_LEAF',  '#B8D2C3 PISTACHIO LITTLE_BEAUX_BLUE','#3E6033 BASIL GREENHOUSE',     '#667C43 CROCODILE MILITARY_GREEN',

		'#21170B BROWN BIGHORN_SHEEP',           '#483720 COFFEE CAFE_NOIR',   '#392912 MOCHA BROWN_TUMBLEWEED',     '#755D3A PEANUT NUT_OIL',       '#342613 CAROB BLACK_SLUG',
		'#341E12 HICKORY BLACK_SLUG',            '#3D3020 WOOD COLA',          '#452716 PECAN DUQQA_BROWN',          '#3F2815 WALNUT BROWN_POD',     '#5F3718 CARAMEL BOCK',
		'#572E0F GINGERBREAD BAKER\'S CHOCOLATE','#422208 SYRUP DARK_EBONY',   '#291606 CHOCOLATE ZINNWALDITE-BROWN','#957D55 TORTILLA TWEED',       '#322417 UMBER SCORCHED',
		'#774A25 TAWNY TROJAN_HORSE_BROWN',      '#361F0D BRUNETTE BLACK_SLUG','#5C2D15 CINNAMON BAKER\'S CHOCOLATE','#4D2B19 PENNY DARK_WOOD_GRAIN','#47382A CEDAR WOODBURN',

		'#6A636C GREY CRACKED_SLATE',  '#373737 SHADOW DARK_GREY',   '#564E5A GRAPHITE MULLED_WINE','#312D31 IRON MOONLESS_NIGHT','#6A687E PEWTER UNEXPLAINED',
		'#C6C6CF CLOUD HERRING_SILVER','#ADADC5 SILVER COSMIC_SKY',  '#625A68 SMOKE MOBSTER',       '#3F3D51 SLATE KNIGHTHOOD',   '#42424B ANCHOR FLINT_PURPLE',
		'#544C4D ASH DARK_LIVER',      '#4D4C5B PORPOISE SQUIDS_INK','#7A6F7E DOVE GOOSE_BILL',     '#635A64 FOG WONDER_WINE',    '#7E7D9A FLINT BLUE_INTRIGUE',
		'#222023 CHARCOAL LEAD',       '#333333 PEBBLE CARBON',      '#403F4C LEAD INTELLECTUAL',   '#9897A8 COIN LAVENDER_ASH',  '#777276 FOSSIL STEEL_ARMOR'

		// '000000','070401','0C0906','27231E','000004',' ',' ',
		// '000000','040301','040100','090806','030106',' ',' ',
		// '020001','140E07','030200','000000','0B0A08',' ',' ',

		],
		ratio: [5,4],
		empty: 0
	},
	pantone_cmyk_coated: {
		colors: [
		'#FEDD00 SUPER_SAIYAN YELLOW-_', '#FFD700 GOLD CYBER-YELLOW_C', '#FE5000 AEROSPACE_ORANGE ORANGE_021', '#F9423A CORAL_RED WARM_RED', '#EF3340 DEEP_CARMINE_PINK RED-032', '#CE0058 RUBINE-RED', '#E10098 HOLLYWOOD-CERISE RHODAMINE-RED',
		'#BB29BB BARNEY PURPLE','#440099 VIOLET_HICKEY VIOLET_C','#10069F GROUNDWATER','#001489 PTHALO_BLUE','#0085CA WATER-RACEWAY','#00AB84 CONGO_GREEN','#2D2926 BOKARA_GREY',
		'#F2F0A1 LEAF_BUD','#FCAEBB POODLE_SKIRT','#F1B2DC SOFT_CASHMERE','#BF9BDE BRIGHT_LAVENDER','#74D1EA MIDDLE_BLUE','#9DE7D7 NEVERLAND','#9E978E MUD_PUDDLE',
		'#009ACE TOMB_BLUE','#44D62C GREEN_JUICE','#FFE900','#FFAA4D','#FF7276','#FF3EB5','#EA27C2',
		'#84754E','#85714D DULL_GOLD','#866D4B','#8B6F4E TOASTED_COCONUT','#87674F','#8B634B RUM_CARAMEL','#8A8D8F WILD_DOVE',
		'#FFD900 ','#FF5E00 ORANGE_SLICE','#F93822 BRIGHT_RED','#CE0056 RUBINE_RED','#D62598 PINK','#4E008E MEDIUM_PURPLE','#00239C MAGNETIC_BLUE',
		'#0084CA PROCESS_BLUE','#00B08B','#222223 DARKEST_HOUR',' ',' ',' ',' ',
		' ',' ',' ',' ',' ',' ',' ','#F6EB61 ','#F7EA48','#FCE300','#C5A900',
		'#AF9800 ','#897A27','#F5E1A4','#ECD898 MELLOW-YELLOW','#EED484 ','#F4DA40 GOLDEN-KIWI','#F2CD00 EMPIRE-YELLOW',
		'#F1C400','#CBA052 BRIGHT-GOLD','#F9E547 BUTTERCUP','#FBE122 VIBRANT-YELLOW','#FEDB00','#FFD100 CYBER_YELLOW','#DAAA00',
		'#AA8A00 GOLDEN_PALM','#9C8412 ','#FAE053 ','#FBDD40','#FDDA24','#FFCD00','#C99700',
		'#AC8400','#897322','#F3DD6D','#F3D54E','#F3D03E','#F2A900','#CC8A00',
		'#A07400','#6C571B','#F8E08E','#FBD872','#FFC845','#FFB81C','#C69214',
		'#AD841F','#886B25','#FBDB65','#FDD757','#FED141','#FFC72C','#EAAA00',
		'#B58500','#9A7611','#FFC600','#FFB500','#D19000','#B47E00','#73531D',
		'#5A4522','#4B3D2A','#D29F13','#B78B20','#9F7D23','#967126','#8F6A2A',
		'#7D622E','#6C5D34','#FDD26E','#FFC658','#FFBF3F','#FFA300','#DE7C00',
		'#AF6D04','#74531C','#FDD086','#FFC56E','#FFB549','#FF9E1B','#D57800',
		'#996017','#6E4C1E','#F2C75C','#F1BE48','#F1B434','#ED8B00','#CF7F00',
		'#A76D11','#715C2A','#F6BE00','#F0B323','#FEAD77','#E6A65D','#D38235',
		'#DC8633','#C16C18','#BD9B60','#D69A2D','#DB8A06','#CD7925','#AD6433',
		'#89532F','#775135','#D78825','#D3832B','#C67D30','#B67233','#A7662B',
		'#9E6A38','#835D32','#FCC89B','#FDBE87','#FDAA63','#F68D2E','#EA7600',
		'#D45D00','#BE4D00','#FECB8B','#FFC27B','#FFB25B','#FF8200','#E57200',
		'#BE6A14','#9B5A1A','#EFD19F','#EFBE7D','#E87722','#CB6015','#A1561C',
		'#603D20','#FFAE62','#FF8F1C','#FF6900','#B94700','#94450B','#653819',
		'#FFB990','#FFA06A','#FF7F32','#FF6A13','#D86018','#A65523','#8B4720',
		'#FFBE9F','#FF9D6E','#FF7F41','#FF671F','#E35205','#BE531C','#73381D',
		'#DB864E','#E07E3C','#DC6B2F','#DC582A','#C05131','#864A33','#674736',
		'#FFA38B','#FF8D6D','#FF6A39','#FC4C02','#DC4405','#A9431E','#833921',
		'#FFB3AB','#FF8674','#FF5C39','#FA4616','#CF4520','#963821','#6B3529',
		'#C4622D','#BA5826','#AF5C37','#9E5330','#924C2E','#7B4D35','#5C4738',
		'#D4B59E','#C07D59','#B15533','#9D432C','#7C3A2D','#6B3D2E','#5C3D31',
		'#D14124','#BD472A','#B33D26','#8D3F2B','#83412C','#7B4931','#674230',
		'#E4D5D3','#E1BBB4','#D6938A','#C26E60','#A4493D','#823B34','#683431',
		'#DDBCB0','#CA9A8E','#BC8A7E','#A37F74','#866761','#6B4C4C','#583D3E',
		'#EABEB0','#C09C83','#B46A55','#AB5C57','#A45248','#9A6A4F','#8A391B',
		'#ECC3B2','#ECBAA8','#EAA794','#E8927C','#DA291C','#9A3324','#653024',
		'#653024','#FFB1BB','#FF808B','#FF585D','#E03C31','#BE3A34','#81312F',
		'#FFA3B5','#FF8DA1','#F8485E','#EE2737','#D22630','#AF272F','#7C2529',
		'#FCAFC0','#FB637E','#F4364C','#CB333B','#A4343A','#643335','#C66E4E',
		'#C04C36','#B7312C','#AB2328','#93272C','#8A2A2B','#802F2D','#E1523D',
		'#C63527','#A72B2A','#9E2A2B','#6D3332','#633231','#572D2D','#E6BAA8',
		'#E56A54','#E04E39','#CD545B','#B04A5A','#9B2242','#651D32','#FABBCB',
		'#FC9BB3','#F65275','#E4002B','#C8102E','#A6192E','#76232F','#ECC7CD',
		'#E89CAE','#DF4661','#D50032','#BA0C2F','#9D2235','#862633','#F8A3BC',
		'#F67599','#EF426F','#E40046','#BF0D3E','#9B2743','#782F40','#F5B6CD',
		'#F59BBB','#EF4A81','#E0004D','#C5003E','#A6093D','#8A1538','#F5DADF',
		'#F7CED7','#F9B5C4','#F890A5','#EF6079','#E03E52','#CB2C30','#F2D4D7',
		'#F4C3CC','#F2ACB9','#D25B73','#B83A4B','#9E2A2F','#ECB3CB','#E782A9',
		'#E0457B','#CE0037','#A50034','#861F41','#6F263D','#F99FC9','#F57EB6',
		'#F04E98','#E31C79','#CE0F69','#AC145A','#7D2248','#F4CDD4','#E06287',
		'#E24585','#B52555','#A4123F','#971B2F','#6A2C3E','#D6C9CA','#C4A4A7',
		'#C16784','#C63663','#BC204B','#912F46','#7E2D40','#EABEDB','#E56DB1',
		'#DA1884','#A50050','#910048','#6C1D45','#936D73','#934054','#8E2C48',
		'#732E4A','#672E45','#582D40','#502B3A','#EF95CF','#EB6FBD','#DF1995',
		'#D0006F','#AA0061','#890C58','#672146','#F4A6D7','#F277C6','#E93CAC',
		'#C6007E','#A20067','#840B55','#EAD3E2','#E6BCD8','#DFA0C9','#D986BA',
		'#C6579A','#AE2573','#960051','#E5CEDB','#E3C8D8','#DEBED2','#C996B6',
		'#B06C96','#994878','#7C2855','#E4C6D4','#DCB6C9','#D0A1BA','#BE84A3',
		'#A76389','#893B67','#612141','#EBBECB','#E8B3C3','#E4A9BB','#D592AA',
		'#84344E','#6F2C3F','#572932','#E2BCCB','#DCA9BF','#C9809E','#B55C80',
		'#A73A64','#9B3259','#872651','#E9CDD0','#E4BEC3','#D7A3AB','#C48490',
		'#B46B7A','#984856','#893C47','#F2C6CF','#F1BDC8','#E9A2B2','#DC8699',
		'#8F3237','#7F3035','#5D2A2C','#E9C4C7','#E5BAC1','#DAA5AD','#C6858F',
		'#7A3E3A','#6A3735','#512F2E','#DFC2C3','#DBB7BB','#CCA1A6','#B07C83',
		'#9C6169','#874B52','#3F2021','#F1A7DC','#EC86D0','#E45DBF','#DB3EB1',
		'#C5299B','#AF1685','#80225F','#EFBAE1','#E277CD','#D539B5','#C800A1',
		'#B0008E','#9E007E','#830065','#EAB8E4','#E59BDC','#DD7FD3','#C724B1',
		'#BB16A3','#A51890','#80276C','#A56E87','#A83D72','#991E66','#8A1B61',
		'#722257','#6A2A5B','#5E2751','#E7BAE4','#DD9CDF','#C964CF','#AD1AAC',
		'#981D97','#72246C','#EBC6DF','#E6BEDD','#E2ACD7','#D48BC8','#93328E',
		'#833177','#612C51','#EEDAEA','#CCAED0','#D59ED7','#B288B9','#A277A6',
		'#9F5CC0','#963CBD','#D7A9E3','#C98BDB','#AC4FC6','#9B26B6','#87189D',
		'#772583','#653165','#948794','#A2789C','#A15A95','#8E3A80','#6E2B62',
		'#6A3460','#5D3754','#D5C2D8','#C9B1D0','#BA9CC5','#A57FB2','#642F6C',
		'#59315F','#4B3048','#DBCDD3','#D0BEC7','#C6B0BC','#AF95A6','#86647A',
		'#66435A','#4A3041','#D8C8D1','#D3C0CD','#BFA5B8','#9B7793','#7E5475',
		'#693C5E','#512A44','#DFC8E7','#D7B9E4','#CAA2DD','#B580D1','#8031A7',
		'#702F8A','#572C5F','#D6BFDD','#C6A1CF','#8C4799','#6D2077','#642667',
		'#5D285F','#51284F','#CBA3D8','#B884CB','#A05EB5','#84329B','#702082',
		'#671E75','#5F2167','#9991A4','#8D6E97','#7A4183','#6B3077','#653279',
		'#5E366E','#5C4E63','#C1A0DA','#A77BCA','#8246AF','#5C068C','#500778',
		'#470A68','#3C1053','#D7C6E6','#C1A7E2','#9063CD','#753BBD','#5F259F',
		'#582C83','#512D6D','#C5B4E3','#AD96DC','#9678D3','#7D55C7','#330072',
		'#2E1A47','#B4B5DF','#9595D2','#7474C1','#24135F','#211551','#201747',
		'#221C35','#A7A4E0','#8B84D7','#685BC7','#2E008B','#280071','#250E62',
		'#201547','#6E7CA0','#686E9F','#615E9B','#565294','#514689','#4C4184',
		'#535486','#DDDAE8','#B6B8DC','#A7A2C3','#8986CA','#5D4777','#4B384C',
		'#41273B','#878CB4','#7C7FAB','#7566A0','#6F5091','#68478D','#563D82',
		'#523178','#E5E1E6','#E0DBE3','#C6BCD0','#A192B2','#7C6992','#614B79',
		'#3F2A56','#D8D7DF','#C6C4D2','#B3B0C4','#8D89A5','#595478','#403A60',
		'#1E1A34','#C5CFDA','#BBC7D6','#A2B2C8','#8E9FBC','#1B365D','#1F2A44',
		'#1C1F2A','#D9E1E2','#A4BCC2','#98A4AE','#768692','#425563','#253746',
		'#131E29','#B9D3DC','#A3C7D2','#8DB9CA','#6BA4B8','#003D4C','#00313C',
		'#072B31','#BFCED6','#B7C9D3','#A6BBC8','#7A99AC','#5B7F95','#4F758B',
		'#081F2C','#D1DDE6','#C6D6E3','#9BB8D3','#7DA1C4','#5E8AB4','#236192',
		'#002E5D','#DBE2E9','#CED9E5','#A7BCD6','#7D9BC1','#326295','#003A70',
		'#002554','#DDE5ED','#C8D8EB','#B1C9E8','#7BA4DB','#407EC9','#003594',
		'#001A70','#BDC5DB','#89ABE3','#8094DD','#7BA6DE','#5F8FB4','#3A5DAE',
		'#606EB2','#CBD3EB','#9FAEE5','#485CC7','#1E22AA','#171C8F','#151F6D',
		'#141B4D','#B8CCEA','#5C88DA','#0047BB','#06038D','#001871','#001E62',
		'#071D49','#C3D7EE','#A7C6ED','#307FE2','#001A72','#001E60','#13294B',
		'#ABCAE9','#8BB8E8','#418FDE','#012169','#00205B','#041E42','#92C1E9',
		'#6CACE4','#0072CE','#0033A0','#003087','#002D72','#0C2340','#94A9CB',
		'#6787B7','#426DA9','#385E9D','#2C5697','#1D4F91','#1D4F91','#C6DAE7',
		'#BDD6E6','#A4C8E1','#7BAFD4','#003C71','#003057','#00263A','#B9D9EB',
		'#9BCBEB','#69B3E7','#003DA5','#002F6C','#002855','#041C2C','#8DC8E8',
		'#62B5E5','#009CDE','#0057B8','#004C97','#003865','#00263E','#71C5E8',
		'#41B6E6','#00A3E0','#005EB8','#004B87','#003B5C','#002A3A','#4698CB',
		'#298FC2','#0076A8','#006298','#005587','#004976','#01426A','#99D6EA',
		'#5BC2E7','#00A9E0','#0077C8','#00629B','#004F71','#003E51','#7BA7BC',
		'#6399AE','#4E87A0','#41748D','#34657F','#165C7D','#005776','#BBDDE6',
		'#71B2C9','#4298B5','#0086BF','#007DBA','#00558C','#002B49','#9ADBE8',
		'#59CBE8','#00B5E2','#006BA6','#00587C','#003B49','#A4DBE8','#8BD3E6',
		'#4EC3E0','#00AFD7','#0095C8','#0082BA','#0067A0','#48A9C5','#009CBD',
		'#0085AD','#007096','#006A8E','#00617F','#005670','#B8DDE1','#9BD3DD',
		'#77C5D5','#3EB1C8','#0093B2','#007396','#005F83','#6AD1E3','#05C3DE',
		'#00A9CE','#0092BC','#007FA3','#00677F','#004851','#68D2DF','#00C1D5',
		'#00AEC7','#008EAA','#00778B','#006272','#004F59','#63B1BC','#00A7B5',
		'#0097A9','#00859B','#007D8A','#007680','#006269','#B1E4E3','#88DBDF',
		'#2DCCD3','#009CA6','#008C95','#007377','#005F61','#A0D1CA','#40C1AC',
		'#00B0B9','#00A3AD','#007398','#005F86','#005A70','#7EDDD3','#5CB8B2',
		'#279989','#007681','#487A7B','#0D5257','#244C5A','#B6CFD0','#ABC7CA',
		'#94B7BB','#7FA9AE','#4F868E','#115E67','#07272D','#00968F','#00857D',
		'#007672','#006D68','#00635B','#005E5D','#005151','#9CDBD9','#64CCC9',
		'#00B2A9','#008675','#007367','#00685E','#00534C','#71DBD4','#2AD2C9',
		'#00BFB3','#00A499','#008578','#00594F','#004C45','#7CE0D3','#2CD5C4',
		'#00C7B1','#00B398','#009681','#007864','#004E42','#6DCDB8','#6DCDB8',
		'#6DCDB8','#49C5B1','#00AB8E','#009B77','#008264','#006A52','#034638',
		'#B9DCD2','#A1D6CA','#86C8BC','#6BBBAE','#006F62','#00594C','#1D3C34',
		'#B5E3D8','#A5DFD3','#98DBCE','#6BCABA','#00816D','#006C5B','#173F35',
		'#ADCAB8','#9ABEAA','#85B09A','#6FA287','#28724F','#205C40','#284734',
		'#BFCEC2','#A7BDB1','#92ACA0','#7F9C90','#5C7F71','#43695B','#183028',
		'#BAC5B9','#B0BDB0','#A3B2A4','#94A596','#708573','#5E7461','#22372B',
		'#BCC9C5','#B1C0BC','#9DB0AC','#829995','#5D7975','#3E5D58','#18332F',
		'#D1E0D7','#B7CDC2','#9AB9AD','#789F90','#507F70','#285C4D','#13322B',
		'#A7E6D7','#8CE2D0','#3CDBC0','#009775','#007B5F','#00664F','#8FD6BD',
		'#6ECEB2','#00B388','#00965E','#007A53','#006747','#115740','#50A684',
		'#00966C','#008755','#007B4B','#006F44','#006845','#005844','#005844',
		'#47D7AC','#00C389','#00AF66','#007749','#006341','#154734','#A0DAB3',
		'#91D6AC','#71CC98','#009A44','#00843D','#046A38','#2C5234','#A2E4B8',
		'#8FE2B0','#80E0A7','#00B140','#009639','#007A33','#215732','#9BE3BF',
		'#26D07C','#00BF6F','#00B74F','#009F4D','#275D38','#00573F','#4B9560',
		'#228848','#007A3E','#007041','#286140','#36573B','#395542','#6BA539',
		'#48A23F','#319B42','#3A913F','#44883E','#4A773C','#44693D','#ADDC91',
		'#A1D884','#6CC24A','#43B02A','#509E2F','#4C8C2B','#4A7729','#D0DEBB',
		'#BCE194','#8EDD65','#78D64B','#74AA50','#719949','#79863C','#C2E189',
		'#B7DD79','#A4D65E','#78BE20','#64A70B','#658D1B','#546223','#D4EB8E',
		'#CDEA80','#C5E86C','#97D700','#84BD00','#7A9A01','#59621D','#C4D6A4',
		'#BCD19B','#B7CE95','#A9C47F','#789D4A','#67823A','#4E5B31','#D0D1AB',
		'#C6C89B','#BABD8B','#A2A569','#8A8D4A','#6D712E','#3D441E','#D2CE9E',
		'#CBC793','#C0BB87','#AFA96E','#A09958','#89813D','#555025','#C3C6A8',
		'#B3B995','#A3AA83','#899064','#737B4C','#5E6738','#3E4827','#BFCC80',
		'#BBC592','#9CAF88','#8F993E','#76881D','#7A7256','#5B6236','#BABC16',
		'#ABAD23','#999B30','#888D30','#7C8034','#727337','#656635','#E2E868',
		'#DBE442','#CEDC00','#C4D600','#A8AD00','#949300','#787121','#E9EC6B',
		'#E3E935','#E0E721','#D0DF00','#B5BD00','#9A9500','#827A04','#E3E48D',
		'#E0E27C','#DBDE70','#D2D755','#B7BF10','#8E8C13','#625D20','#F0EC74',
		'#EDE939','#ECE81A','#E1E000','#BFB800','#ADA400','#A09200','#F3EA5D',
		'#F3E500','#EFDF00','#EEDC00','#BBA600','#9A8700','#685C20','#F1EB9C',
		'#F0E991','#F0E87B','#EDE04B','#EADA24','#E1CD00','#CFB500','#EBE49A',
		'#E9E186','#E6DE77','#E1D555','#D7C826','#C4B000','#B39B00','#E9DF97',
		'#E4D77E','#DECD63','#D9C756','#B89D18','#A28E2A','#695B24','#DCD59A',
		'#D6CF8D','#D0C883','#C0B561','#AC9F3C','#AC9F3C','#9F912A','#8A7B19',
		'#CAB64B','#CFB023','#C1A01E','#A08629','#897630','#736635','#675E33',
		'#D4C304','#C4B200','#91852C','#747136','#5D6439','#585C3B','#535435',
		'#BBB323','#B4A91F','#AA9D2E','#8F7E35','#716135','#635939','#4E4934',
		'#D5CB9F','#CFC493','#C5B783','#B3A369','#998542','#8C7732','#614F25',
		'#CAC7A7','#BFBB98','#B0AA7E','#9B945F','#594A25','#524727','#4A412A',
		'#F1E6B2','#DFD1A7','#D9C89E','#CEB888','#A89968','#94795D','#816040',
		'#DDCBA4','#D3BC8D','#C6AA76','#B9975B','#8B5B29','#744F28','#5C462B',
		'#EFDBB2','#FCD299','#E1B87F','#D6A461','#C6893F','#B77729','#A6631B',
		'#EDC8A3','#E7B78A','#DDA46F','#C88242','#B36924','#934D11','#7D3F16',
		'#F3CFB3','#F1C6A7','#F0BF9B','#E59E6D','#B86125','#A45A2A','#693F23',
		'#E0C09F','#D9B48F','#CDA077','#B58150','#9E652E','#774212','#623412',
		'#E0C6AD','#DCBFA6','#CDA788','#BF9474','#AD7C59','#946037','#4F2C1D',
		'#E1B7A7','#D5A286','#C58B68','#99552B','#85431E','#6D4F47','#5E4B3C',
		'#D7C4B7','#CDB5A7','#C0A392','#AE8A79','#956C58','#7C4D3A','#5B3427',
		'#DBC8B6','#D3BBA8','#C6A992','#AA8066','#703F2A','#623B2A','#4E3629',
		'#D6D2C4','#C5B9AC','#B7A99A','#A39382','#7A6855','#63513D','#473729',
		'#D1CCBD','#B7B09C','#A69F88','#A7ACA2','#949A90','#8E9089','#4B4F54',
		'#D0D3D4','#C1C6C8','#A2AAAD','#7C878E','#5B6770','#333F48','#1D252D',
		'#C7C9C7','#B2B4B2','#9EA2A2','#898D8D','#707372','#54585A','#25282A',
		'#BEC6C4','#A2ACAB','#919D9D','#717C7D','#505759','#3F4444','#373A36',
		'#BABBB1','#A8A99E','#919388','#7E7F74','#65665C','#51534A','#212322',
		'#C4BFB6','#AFA9A0','#9D968D','#8C857B','#776E64','#696158','#C4BCB7',
		'#B2A8A2','#978C87','#857874','#746661','#5E514D','#382F2D','#D0C4C5',
		'#C1B2B6','#AB989D','#7B6469','#584446','#453536','#382E2C','#D7D2CB',
		'#CBC4BC','#CBC4BC','#BFB8AF','#B6ADA5','#ACA39A','#A59C94','#968C83',
		'#8C8279','#83786F','#796E65','#6E6259','#D9D9D6','#D0D0CE','#C8C9C7',
		'#BBBCBC','#B1B3B3','#A7A8AA','#97999B','#888B8D','#75787B','#63666A',
		'#53565A','#332F21','#212721','#31261D','#3E2B2E','#101820','#3D3935'
		],
		ratio: [1,1],
		empty: 0
	},
	pantone_goe_coated: {
		colors: [
		'#EDEED3 1-1-1_C', '#EEEEB9 1-1-2_C', '#F0EC93 1-1-3_C',
		'#F2EA6F 1-1-4_C', '#F4E737 1-1-5_C', '#F7E200 1-1-6_C',
		'#FBD800 1-1-7_C', '#E9E8C2 1-2-1_C', '#E9E6A0 1-2-2_C',
		'#E5DF82 1-2-3_C', '#DFD459 1-2-4_C', '#D4C421 1-2-5_C',
		'#C9B600 1-2-6_C', '#B7A000 1-2-7_C', '#E5E2B6 1-3-1_C',
		'#DAD489 1-3-2_C', '#CAC05B 1-3-3_C', '#BBAE36 1-3-4_C',
		'#AE9F19 1-3-5_C', '#9E8C00 1-3-5_C', '#8C7900 1-3-7_C',
		'#E5E5D3 1-4-1_C', '#D5D1A7 1-4-2_C', '#BEB779 1-4-3_C',
		'#BEB779 1-4-4_C', '#908534 1-4-5_C', '#7A6D1F 1-4-6_C',
		'#5C5017 1-4-7_C', '#CFB100 1-5-1_C', '#B59B00 1-5-2_C',
		'#9D8600 1-5-3_C', '#8B7600 1-5-4_C', '#78660E 1-5-5_C',
		'#635517 1-5-6_C', '#49401C 1-5-7_C', '#EFEAA7 2-1-1_C',
		'#F1E784 2-1-2_C', '#F4E35F 2-1-3_C', '#F7DF33 2-1-4_C',
		'#FAD900 2-1-5_C', '#FECE00 2-1-6_C', '#FFBE00 2-1-7_C',
		'#EEEAC5 3-1-1_C', '#F1E89F 3-1-2_C', '#F4E47A 3-1-3_C',
		'#F9DA44 3-1-4_C', '#FECF00 3-1-5_C', '#FFC100 3-1-6_C',
		'#FEAD00 3-1-7_C', '#F4E38F 4-1-1_C', '#F8DC69 4-1-2_C',
		'#FBD64B 4-1-3_C', '#FFCB00 4-1-4_C', '#FFBC00 4-1-5_C',
		'#FFB200 4-1-6_C', '#FFA100 4-1-7_C', '#F2E5AA 5-1-1_C',
		'#F7DC82 5-1-2_C', '#FBD35B 5-1-3_C', '#FFC82A 5-1-4_C',
		'#FFBD00 5-1-5_C', '#FFAB00 5-1-6_C', '#FF9700 5-1-7_C',
		'#EEC956 6-1-1_C', '#EEBF3E 6-1-2_C', '#EDB220 6-1-3_C',
		'#ECA400 6-1-4_C', '#EB9700 6-1-5_C', '#E98A00 6-1-6_C',
		'#E77D00 6-1-7_C', '#F5E1A6 7-1-1_C', '#F9D888 7-1-2_C',
		'#FDCE61 7-1-3_C','#FFBD31 7-1-4_C','#FFAD00 7-1-5_C',
		'#FF9A00 7-1-6_C','#FF8600 7-1-7_C','#EDD89D 7-2-1_C',
		'#ECCA78 7-2-2_C','#E8BC5A 7-2-3_C','#E1A92D 7-2-4_C',
		'#CC8800 7-2-5_C','#BD7300 7-2-6_C','#E6D6A9 7-2-7_C',
		'#DDC17B 7-3-1_C','#CDA850 7-3-2_C','#BE932D 7-3-3_C',
		'#B38419 7-3-4_C','#A17000 7-3-5_C','#8D5C00 7-3-6_C',
		'#EDDB93 7-3-7_C','#EDCE75 8-1-1_C','#EDBA44 8-1-2_C',
		'#ECAD27 8-1-4_C','#EA9900 8-1-5_C', '#E98800 8-1-6_C',
		'#E67300 8-1-7_C','#C07000 8-2-1_C','#A96907 8-2-2_C',
		'#945E0F 8-2-3_C','#815614 8-2-4_C','#704E19 8-2-5_C',
		'#5B431C 8-2-6_C','#45351D 8-2-7_C','#ECD595 9-1-1_C',
		'#EBBE65 9-1-2_C','#EBBE65 9-1-3_C','#E99A27 9-1-4_C',
		'#E78603 9-1-5_C','#E57900 9-1-6_C','#E26400 9-1-7_C',
		'#F3B06E 10-1-1_C','#ED9D4A 10-1-2_C','#E38B26 10-1-3_C',
		'#DB7F06 10-1-4_C','#D17700 10-1-5_C','#C26800 10-1-6_C',
		'#B15B00 10-1-7_C','#E59C55 11-1-1_C','#DF9041 11-1-2_C',
		'#D7842E 11-1-3_C','#CC7616 11-1-4_C','#C26B04 11-1-5_C',
		'#BA6300 11-1-6_C','#A95600 11-1-7_C','#9D5108 11-2-1_C',
		'#924D0C 11-2-2_C','#7D4312 11-2-3_C','#723F14 11-2-4_C',
		'#653A18 11-2-5_C','#573419 11-2-6_C','#452B19 11-2-7_C',
		'#F6DCAF 12-1-1_C','#FBD293 12-1-2_C','#FBD293 12-1-3_C',
		'#FFB246 12-1-4_C','#FFA110 12-1-5_C','#FF8A00 12-1-6_C',
		'#FF7200 12-1-7_C','#F5DEC7 12-1-1_C','#FCCCA1 13-1-2_C',
		'#FFB87B 13-1-3_C','#FFA351 13-1-4_C','#FF9127 13-1-5_C',
		'#FF7C00 13-1-6_C','#FF5D00 13-1-7_C'
		],
		ratio: [1,1],
		empty: 0
	},
	pantone_metallics_coated: {
		colors: [
		'#89764B 871_C','#89734C 872_C','#8C714C 873_C',
		'#896C4C 874_C','#8C6A51 875_C','#8F654D 876_C',
		'#8D9093 877_C','#8C8B89 8001_C','#8B847C 8002_C',
		'#8B8075 8003_C','#897A69 8004_C','#87715A 8005_C',
		'#887157 8006_C','#9A887B 8020_C','#9F8170 8021_C',
		'#A87357 8022_C','#AA6443 8023_C','#AD5B2F 8024_C',
		'#A95225 8025_C','#95908D 8040_C','#9C847C 8041_C',
		'#9E7B71 8042_C','#A56E60 8043_C','#A55F49 8044_C',
		'#A25840 8045_C','#99858D 8060_C','#9B7983 8061_C',
		'#9F6D79 8062_C','#A45F6C 8063_C',''
		],
		ratio: [1,1],
		empty: 0
	},
	encycolorpedia: {
		colors: [
		'#F75394 VIOLET-RED','#CF3476 TELEMAGENTA','#66424D DEEP_TUSCAN_RED',
		'#8E3A59 QUINACRIDONE_MAGENTA','#F29CB7 HARMONIOUS_ROSE','#FD3F92 FRENCH_FUCHSIA',
		'#AA4069 MEDIUM_RUBY','#F7238A BARBIE_PINK_(1999-2004)','#FDDDE6 PIGGY_PINK',
		'#e4007c MEXICAN_PINK','#F56FA1 CYCLAMEN','#E68FAC CHARM_PINK',
		'#F2BDCD ORCHID_PINK','#D0417E MAGENTA_(PANTONE)','#FA1A8E PHILIPPINE_PINK',
		'#CC397B FUCHSIA_PURPLE','#FF0090 MAGENTA (PROCESS)','#EFBBCC CAMEO_PINK',
		'#F6ADC6 NADESHIKO_PINK','#FF1493 DEEP_PINK','#A50B5E JAZZBERRY_JAM',
		'#FC419A BARBIE_PINK_(2005-2009)','#F19CBB AMARANTH_PINK','#E85395 BARBIE_PINK_(1959-1975)',
		'#843f5b DEEP_RUBY','#F364A2 BARBIE_PINK_(1990-1999)','#FF55A3 BRILLIANT_ROSE',
		'#DA1D81 VIVID_CERISE','#673147 OLD_MAUVE','#B48395 ENGLISH_LAVENDAR',
		'#FFF0F5 LAVENDAR_BLUSH','#DA3287 DEEP_CERISE','#FFA6C9 CARNATION_PINK',
		'#CA1F7B MAGENTA_(DYE)','#F9429E ROSE_BOURBON','#E0218A BARBIE_PINK_(PANTONE)',
		'#E94196 BARBIE_PINK','#78184A PANSY_PURPLE','#FF43A4 WILD_STRAWBERRY',
		'#DE70A1 CHINESE_PINK','#66033C SPANISH_PURPLE','#66023C IMPERIAL_PINK',
		'#872657 DARK_RASPBERRY','#DE6FA1 CHINA_PINK','#E25098 RASPBERRY_PINK',
		'#E73895 ROYAL_PINK','#C84186 SMITTEN','#FE28A2 PERSIAN_ROSE',
		'#9F2B68 AMARANTH_DEEP_PURPLE','#EDA6C4 METALLIC_PINK','#E8CCD7 QUEEN_PINK',
		'#F49AC2 PASTEL_MAGENTA','#FF69B4 HOT_PINK','#FFDAE9 MIMI_PINK',
		'#F8B9D4 LITTLE_GIRL_PINK','#AD4379 MYSTIC_MAROON','#FFBCD9 COTTON_CANDY',
		'#D74894 PINK_(PANTONE)','#811453 FRENCH_PLUM','#BB7796 RED_WISTERIA_(BENIFUJI)',
		'#E9399E STRONG_BOY_PINK','#C54B8C MULBBERRY','#D470A2 WILD_ORCHID',
		'#CC338B MAGENTA-PINK','#FBAED2 LAVENDAR_PINK','#F400A1 FASHION_FUCHSIA',
		'#873260 BOYSENBERRY','#C71585 MEDIUM_VIOLET-RED','#FF99CC PALE_MAGENTA-PINK',
		'#F77FBE PERSIAN_PINK','#9F4576 MAGENTA_HAZE','#8A496B TWILIGHT_LAVENDER',
		'#A2006D FLIRT','#6D2B50 VINE_GRAPE_(EBIZOME)','#BB3385 MEDIUM_RED-VIOLET',
		'#A63A79 MAXIMUM_RED_PURPLE','#E79FC4 KOBI','#614051 EGGPLANT',
		'#23191E DARK_RED_(KUROBENI)','#E936A7 FROSTBITE','#C0448F RED-VIOLET_(CRAYOLA)',
		'#CA2C92 ROYAL_FUCHSIA','#534B4F DARK_LIVER','#D3419D BARBIE_PINK_(1975-1990)',
		'#914E75 SUGAR_PLUM','#C8509B MULBERRY_(CRAYOLA)','#FFB3DE LIGHT_HOT_PINK',
		'#D982B5 MIDDLE_PURPLE','#FF85CF PRINCESS_PERFUME','#B53389 FANDANGO',
		'#CF6BA9 SUPER_PINK','#663854 HALAYÀ_UBE_(PURPLE_YAM_JAM)','#FBCCE7 CLASSIC_ROSE',
		'#E7ACCF PINK_PEARL','#FC0FC0 SHOCKING_PURPLE','#FF66CC ROSE_PINK',
		'#FF5CCD LIGHT_DEEP_PINK','#CF71AF SKY_MAGENTA','#997A8D MOUNTBATTEN_PINK',
		'#BD559C ROSE_QUARTZ_PINK','#FF33CC RAZZLE_DAZZLE_ROSE','#491E3C RABBIT-EAR_IRIS_(KAKITSUBATA)',
		'#FF1DCE HOT_MAGENTA','#EBB0D7 THISTLE_(CRAYOLA)','#963D7F VIOLET_(CRAYOLA)',
		'#B784A7 OPERA_MAUVE','#FFDDF4 PINK_LACE','#B768A2 PEARLY_PURPLE',
		'#8B8589 TAUPE_GRAY','#FE4EDA PURPLE_PIZZAZZ','#FBA0E3 LAVENDER_ROSE',
		'#915C83 ANTIQUE_FUCHSIA','#FFCFF1 SHAMPOO','#5D3954 DARK_BYZANTIUM',
		'#BD33A4 BYZANTINE','#763568 IRIS_COLOR_(AYAME-IRO)','#2B2028 BLUE_VIOLET_(SHIKON)',
		'#702963 BYZANTIUM','#E6A8D7 LIGHT_ORCHID','#E29CD2 ORCHID_(CRAYOLA)',
		'#F984E5 PALE_MAGENTA','#51484F QUARTZ','#A87CA0 THIN_COLOR_(USU-IRO)',
		'#682860 PALATINATE_PURPLE','#50404D PURPLE_TAUPE','#D8B2D1 PINK_LAVENDER',
		'#8E4585 PLUM','#8D4E85 RAZZMIC_BERRY','#AE98AA LILAC_LUSTER',
		'#5B3256 JAPANESE_VIOLET','#D39BCB LIGHT_MEDIUM_ORCHID','#4F284B PURPLE_(MURASAKI)',
		'#F984EF LIGHT_FUCHSIA_PINK','#880085 MARDI_GRAS','#81007F PHILIPPINE_VIOLET',
		'#FF00FF FUCHSIA','#800080 PATRIARCH','#8B008B DARK_MAGENTA',
		'#CC00CC DEEP_MAGENTA','#DA70D6 ORCHID','#CC33CC STEEL_PINK',
		'#702670 MIDNIGHT','#FF6FFF SHOCKING_PINK_(CRAYOLA)','#C154C1 DEEP_FUCHSIA',
		'#FF77FF FUCHSIA_PINK','#FF80FF LIGHT_MAGENTA','#FC74FD PINK_FLAMINGO',
		'#CB99C9 PASTEL_VIOLET','#D473D4 DEEP_MAUVE','#EE82EE LAVENDER_MAGENTA',
		'#796878 OLD_LAVENDER','#8D608C HALF_COLOR_(HASHITA-IRO)','#AA98A9 HELIOTROPE_GRAY',
		'#DDA0DD MEDIUM_LAVENDER_MAGENTA','#CC99CC LIGHT_GRAYISH_MAGENTA','#C8A2C8 LILAC',
		'#D8BFD8 THISTLE','#3A243B DEEP_PURPLE_(KOKIMURASAKI)','#FAE6FA PALE_PURPLE_(PANTONE)',
		'#242124 RAISIN_BLACK','#AA00BB HELIOTROPE_MAGENTA','#976E9A TATARIAN_ASTER_COLOR_(SHION-IRO)',
		'#856088 CHINESE_VIOLET','#DF00FF PHLOX','#B39EB5 PASTEL_PURPLE',
		'#301934 DARK_PURPLE','#733380 MAXIMUM_PURPLE','#F1A7FE RICH_BRILLIANT_LAVENDER',
		'#602F6B IMPERIAL','#BA55D3 MEDIUM_ORCHID','#F4BBFF RICH_BRILLIANT_LAVENDER',
		'#86608E FRENCH_LILAC','#9F00C5 PURPLE_(MUNSELL)','#B80CE3 VIVID_MULBBERRY',
		'#9A4EAE PURPUREUS','#563C5C ENGLISH_VIOLET','#CC00FF VIVID_ORCHID',
		'#DF73FF HELIOTROPE','#B284BE AFRICAN_VIOLET','#8601AF VIOLET_(RYB)',
		'#9C51B6 PURPLE_PLUM','#D891EF BRIGHT__LILAC','#B666D2 RICH_LILAC',
		'#6C3082 EMINENCE','#720B98 CHINESE_PURPLE','#BF00FF ELECTRIC_PURLPE',
		'#7F3E98 CADMIUM_VIOLET','#431C53 AMERICAN_PURPLE','#AB92B3 GLOSSY_GRAPE',
		'#9400D3 DARK_VIOLET','#9932CC DARK_ORCHID','#5D3F6A BELLFLOWER_COLOR_(KIKYO-IRO)',
		'#716675 RUM','#CDA4DE TROPICAL_VIOLET','#9955BB DEEP_LILAC',
		'#875F9A WISTERIA_PURPLE_(FUJIMURASAKI)','#D19FE8 BBRIGHT_UBE','#C9A0DC WISTERIA',
		'#9C8AA4 DEEP_AMETHYST','#8806CE FRENCH_VIOLET','#A020F0 PURPLE_(X11)',
		'#5B0A91 METALLIC_VIOLET','#9F00FF VIVID_VIOLET','#A76BCF RICH_LAVENDER',
		'#6A0DAD PURPLE','#E0B0FF MAUVAE','#4B0082 INDIGO',
		'#B57EDC LAVENDER_(FLORAL)','#D6CADD LANGUID_LAVENDER','#D6CADD GRAPE',
		'#614E6E DARK_INDIGO_(FUTAAI)','#8F00FF ELECTRIC_VIOLET','#8A2BE2 BLUE-VIOLET',
		'#551B8C AMERICAN_VIOLET','#BA93D8 LENURPLE','#4D1A7F BLUE-VIOLET_(COLOR_WHEEL)',
		'#330066 DEEP_VIOLET','#69359C PURPLE_HEART','#663399 REBBECCA_PURPLE',
		'#32174D RUSSIAN_VIOLET','#766980 MOUSY_WISTERIA_(FUJINEZUMI)','#BF94E4 BRIGHT_LAVENDER',
		'#7F00FF VIOLET_(COLOR_WHEEL)','#734F96 DARK_LAVENDER','#9966CC AMETHYST',
		'#89729E WISTERIA_COLOR_(FUJI-IRO)','#CC99FF PALE_VIOLET','#522D80 REGALIA',
		'#512888 KSU_PURPLE','#6F00FF ELECTRIC_INDIGO','#9678B6 PURPLE_MOUNTAIN_MAJESTY',
		'#7851A9 ROYAL_PURPLE','#9457EB LAVENDER_INDIGO','#4C2882 SPANISH_VELVET',
		'#967BB6 LAVENDER_PURPLE','#391285 PIXIE_POWDER','#32127A PURPLE_INDIGO',
		'#553592 BLUE-MAGENTA_VIOLET','#966FD6 DARK_PASTEL_PURPLE','#5218FA HAN_PURPLE',
		'#58427C CYBER_GRAPE','#3F00FF ELECTRIC_ULTRAMARINE','#360CCC INTERDIMENSIONAL_BLUE',
		'#1B03A3 NEON_BLUE','#9370DB MEDIUM_PURPLE','#000080 NAVY_BLUE','#00008B DARK_BLUE',
		'#00009C DUKE_BLUE','#0000CD MEDIUM_BLUE','#0000FF BLUE',
		'#8B72BE MIDDLE_BLUE_PURPLE','#1C1CF0 BLUEBONNET','#B19CD9 LIGHT_PASTEL_PURPLE',
		'#0A1195 CADMIUM_BLUE','#02075D DARK_NAVY','#0014A8 ZAFFRE',
		'#F8F4FF MAGNOLIA','#000F89 PATHALO_BLUE','#8366F4 VIOLETS_ARE_BLUE',
		'#0018A8 BLUE_(PANTONE)','#5A4F74 SAFLOWER_COLOR_(BENIKAKEHANA-IRO)',
		'#3D325D JACARTA','#5946B2 PLUM_PURPLE','#00147E DARK_IMPERIAL_BLUE',
		'#6050DC MAJORELLE_BLUE','#191970 MIDNIGHT_BLUE','#4F42B5 OCEAN_BLUE',
		'#7B68EE MEDIUM_SLATE_BLUE','#6A5ACD SLATE_BLUE','#091F92 INDIGO_DYE',
		'#8878C3 UBE (PURPLE YAM)','#483D8B DARK_SLATE_BLUE','#5A4FCF IRIS',
		'#273BE2 PALANTINE_BLUE','#DCD0FF PALE_LAVENDER','#12279E SAMSUNG_BLUE',
		'#2E2D88 COSMIC_COBALT','#7366BD BLUE_VIOLET_(CRAYOLA)','#002395 IMPERIAL_BLUE',
		'#AAA9AD SILVER_(METALLIC)','#0247FE BLUE_(RYB)','#6666FF VERY_LIGHT_BLUE',
		'#002387 RESOLUTION_BLUE','#23297A ST._PATRICKS_BLUE','#1C39BB PERSIAN_BLUE',
		'#766EC8 VIOLET_BLUE_(CRAYOLA)','#746CC0 TOOLBOX','#0033AA UA_BLUE',
		'#1034A6 EGYPTIAN_BLUE','#CEC8EF SOAP','#333366 DEEP_KOAMARU',
		'#C0C0C0 ARGENT','#8C8C8C PHILIPPINE_GRAY','#696969 DIM_GRAY',
		'#BEBEBE GRAY (X11)','#D3D3D3 LIGHT_GRAY','#808080 TROLLEY_GRAY',
		'#CCCCCC CHINESE_SILVER','#343434 JET','#FFFFFF WHITE',
		'#D6D6D6 ALUMINUM','#555555 DAVY\'S GREY','#1B1B1B EERIE_BLACK',
		'#989898 SPANISH_GRAY','#D8D8D8 LIGHT_SILVER','#F8F8F8 GUYABANO',
		'#F5F5F5 CULTURED','#DCDCDC GAINSBORO','#B3B3B3 PHILIPPINE_SILVER',
		'#A6A6A6 QUICK_SILVER','#ACACAC SILVER_CHALICE','#757575 SONIC_SILVER',
		'#CFCFCF AMERICAN_SILVER','#A9A9A9 DARK_GRAY_(X11)','#333333 DARK_CHARCOAL',
		'#676767 GRANITE_GRAY','#141414 CHINESE_BLACK','#080808 VAMPIRE_BLACK',
		'#0040BE PANASONIC_BLUE','#0038A8 ROYAL_AZURE','#0038A7 PHILIPPINE_BLUE',
		'#2243B6 DENIM_BLUE','#3B3B6D AMERICAN_BLUE','#003399 DARK_POWDER_BLUE',
		'#00308F AIR_FORCE_BLUE_(USAF)','#4166F5 ULTRAMARINE_BLUE','#324AB2 VIOLET-BLUE',
		'#062A78 CATALINA_BLUE','#545AA7 LIBERTY','#666699 DARK_BLUE-GRAY',
		'#214FC6 NEW_CAR','#002366 ROYAL_BLUE_(DARK)','#78779B STAINED_RED_(BENIMIDORI)',
		'#C4C3D0 LAVENDER_GRAY','#777696 RHYTHM','#191F45 NAVY_BLUE_BELLFLOWER_(KONIKYO)',
		'#0048BA ABSOLUTE_ZERO','#ACACE6 MAXIMUM_BLUE_PURPLE','#17182B ELDERBERRY',
		'#001440 CETACEAN_BLUE','#4E5180 PURPLE_NAVY','#A2A2D0 BLUE_BELL',
		'#2A52BE CURELEAN_BLUE','#CCCCFF LAVENDER_BLUE','#233067 INDIGO_(RAINBOW)',
		'#4169E1 ROYAL_BLUE_(LIGHT)','#BFC0EE VODKA','#0047AB COBALT_BLUE',
		'#E6E6FA LAVENDER_MIST','#F8F8FF GHOST_WHITE','#0070FF BRANDEIS BLUE',
		'#26428B DARK_CORNFLOWER_BLUE','#0F52BA SAPPHIRE','#1F75FE BLUE_(CRAYOLA)',
		'#1D2951 SPACE_CADET','#446CCF HAN_BLUE','#003171 PRUSSIAN_BLUE_COLOR_(KONJO-IRO)',
		'#4C516D INDEPENDENCE','#365194 CHINESE_BLUE','#39569C FACEBOOK_BLUE',
		'#4F86F7 BLUEBERRY','#216BD6 FLICKR_BLUE','#1B294B DARK_BLUE_LAPIS_LAZULI_(RURIKON)',
		'#007FFF AZURE','#002E63 COOL_BLACK','#246BCE CELTIC_BLUE',
		'#1F4788 LAPIS_LAZULI_COLOR_(RURI-IRO)','#2D68C4 TRUE_BLUE','#1560BD DENIM_BLUE',
		'#979AAA MANTEE','#2E5090 YINMN_BLUE','#181B26 COARSE_WOOL_COLOR_(KACHI-IRO)',
		'#8C92AC COOL_GREY','#4C8BF5 GOOGLE_CHROME_BLUE','#00468C MIDNIGHT_BLUE',
		'#002147 OXFORD_BLUE','#92A1CF CEIL','#0F4D92 YALE_BLUE',
		'#004F98 USAFA_BLUE','#003366 DARK_MIDNIGHT_BLUE','#C5CBE1 LIGHT_PERIWINKLE',
		'#28589C CYAN_COBALT_BLUE','#A2ADD0 WILD_BLUE_YONDER','#1C2841 YANKEES_BLUE',
		'#192236 DARK_BLUE','#A8A9AD CHROME_ALUMINUM','#6495ED CORNFLOWER_BLUE',
		'#EBECF0 BRIGHT_GRAY','#035096 MEDIUM_ELECTRIC_BLUE','#1974D2 BRIGHT_NAVY_BLUE',
		'#536895 UCLA_BLUE','#2E5894 B\'DAZZLED_BLUE','#1E90FF DODGER_BLUE',
		'#1164B4 GREEN-BLUE','#0073CF TRUE_BLUE','#003B6F TARDIS_BLUE',
		'#0078D7 MICROSOFT_EDGE_BLUE','#08457E DARK_CERULEAN','#5B92E5 UNITED_NATIONS_BLUE',
		'#003A6C ATENEO_BLUE','#C3CDE6 PERIWINKLE_(CRAYOLA)','#5072A7 BLUE_YONDER',
		'#7C9ED9 VISTA_BLUE','#3399FF BRILLIANT_AZURE','#318CE7 BLEU_DE_FRANCE',
		'#1F8EED WEEBLY_BLUE','#6082B6 GLACOUS','#838996 ROMAN_SILVER',
		'#E9EDF6 COCONUT_WHITE','#32527B METALLIC_BLUE','#26619C LAPIS_LAZULI',
		'#3E8EDE TUFTS_BLUE','#7EB6FF PARAKEET_BLUE','#A9B2C3 CADET_BLUE_(CRAYOLA)',
		'#88ACE0 LIGHT_COBALT_BLUE','#0070B8 SPANISH_BLUE','#0072BB FRENCH_BLUE',
		'#0088DC BLUE_COLA','#77B5FE FRENCH_SKY_BLUE','#4682BF CYAN-BLUE_AZURE',
		'#006DB0 HONOLULU_BLUE','#003153 PRUSSIAN_BLUE','#6CA0DC LITTLE_BOY_BLUE',
		'#0077BE OCEAN_BOAT_BLUE','#0067A5 MEDIUM_PERSIAN_BLUE','#8AB9F1 JORDY_BLUE',
		'#5D89BA SILVER_LAKE_BLUE','#00416A DARK_IMPERIAL_BLUE','#436B95 QUEEN_BLUE',
		'#779ECB DARK_PASTEL_BLUE','#778BA5 SHADOW_BLUE','#0072B1 LINKEDIN_BLUE',
		'#4E82B4 CYAN-AURE','#B0C4DE LIGHT_STEEL_BLUE','#6699CC BLUE-GRAY',
		'#2887C8 GREEN-BLUE_(CRAYOLA)','#24A0ED BUTTON_BLUE','#74BBFB VERY_LIGHT_AZURE',
		'#4682B4 STEEL_BLUE','#007BB8 STAR_COMMAND_BLUE','#5DADEC BLUE_JEANS',
		'#4997D0 CELESTIAL_BLUE','#00A2ED MICROSOFT_BLUE','#ABCDEF PALE_CORNFLOWER_BLUE',
		'#A1CAF1 BABY_BLUE_EYES','#6D9BC3 CERULEAN_BLUE','#778899 LIGHT_SLATE_GRAY',
		'#708090 SLATE_GRAY','#71A6D2 ICEBERG','#54626F BLACK_CORAL',
		'#0892D0 RICH_ELECTRIC_BLUE','#010B13 RICH_BLACK','#73C2FB MAYA_BLUE',
		'#56A0D3 CAROLINA_BLUE','#7CB9E8 AERO','#F2F3F4 ANTI-FLASH_WHITE',
		'#010203 RICH_BLACK_(FOGRA39)','#188BC2 CYAN_CORNFLOWER_BLUE','#00AAEE VIVID_CERULEAN',
		'#5D8CAE ULTRAMARINE_COLOR_(GUNJO-IRO)','#0087BD BLUE_(NCS)','#006994 SEA_BLUE',
		'#2496CD DOUBAN_BLUE','#F0F8FF ALICE_BLUE','#72A0C1 AIR_SUPERIORITY_BLUE',
		'#536878 DARK_ELECTRIC_BLUE','#9BC4E2 PALE_CERULEAN','#5D8AA8 AIR_FORCE_BLUE_(RAF)',
		'#DBE9F4 AZUREISH_WHITE','#00B9FB BLUE_BOLT','#45B1E8 PICTION_BLUE',
		'#BCD4E6 BEAU_BLUE','#87CEFA LIGHT_SKY_BLUE','#007BA7 CELADON_BLUE',
		'#91A3B0 CADET_GREY','#26A7DE TWITTER_BLUE','#7C98AB WELDON_BLUE',
		'#007AA5 CG_BLUE','#36454F CHARCOAL','#00BFFF CAPRI',
		'#126180 BLUE_SAPPHIRE','#0FC0FC SPIRO_DISCO_BLUE','#93CCEA CORNFLOWER',
		'#1F262A DARK_GUNMETAL','#87D3F8 PALE_CYAN','#00B7EB CYAN_(PROCESS)',
		'#044F67 LIGHT_BLUE_SILK (HANADA)','#4D8FAC SKY_BLUE_COLOR_(SORA-IRO)','#89CFF0 BABY_BLUE',
		'#8BA8B7 PEWTER_BLUE','#8CBED6 DARK_SKY_BLUE','#73A9C2 MOONSTONE_BLUE',
		'#2A3439 GUNMETAL','#536872 CADET','#C4D8E2 COLUMBIA_BLUE',
		'#00CCFF VIVID_SKY_BLUE','#BFC1C2 SILVER_SAND','#1DACD6 BATTERY_CHARGED_BLUE',
		'#44798E JELLY_BEAN_BLUE','#87CEEB SKY_BLUE','#47ABCC MAXIMUM_BLUE',
		'#0D98BA BLUE-GREEN','#0CBFE9 BLUE_RASPBERRY','#0095B6 BONDI_BLUE',
		'#A6E7FF FRESH_AIR','#344D56 IRON_HEAD_FLOWER_COLOR_(NOSHIMEHANA-IRO)',
		'#A0E6FF WINTER_WIZARD','#6AB2CA DELICATE_GIRL_BLUE','#21ABCD BALL_BLUE',
		'#AEC6CF PASTEL_BLUE','#317589 THOUSAND_HERB_COLOR_(CHIGUSA-IRO)',
		'#367588 TEAL_BLUE','#4D646C OPPOSITE_FLOWER_COLOR_(MASUHANA-IRO)',
		'#1CA9C9 PACIFIC_BLUE','#1D697C LIGHT_BLUE_FLOWER_(HANAASAGI)','#3D4C51 KIMONO_STORAGE_(OMESHIONADO)',
		'#0093AF BLUE_(MUNSELL)','#ADD8E6 LIGHT_BLUE','#353839 ONYX','#4A646C DEEP_SPACE_SPARKLE',
		'#68A0B0 CRYSTAL_BLUE','#3AA8C1 MOONSTONE','#006C7F "NEW_BRIDGE" COLOR (SHINBBASHI-IRO)',
		'#A4DDED NON-PHOTO_BLUE','#00C3E3 HAWAII_BLUE','#D2D9DB ALUMINUM_FOIL',
		'#D4F1F9 WATER','#1AC1DD CARIBBEAN_BLUE','#B9F2FF DIAMOND',
		'#7ED4E6 MIDDLE_BLUE','#414A4C OUTER_SPACE','#76D7EA SKY_BLUE_(CRAYOLA)',
		'#80DAEB MEDIUM_SKY_BLUE','#004953 MIDNIGHT_GREEN_(EAGLE_GREEN)','#264348 JAPANESE_INDIGO',
		'#2D383A OUTER_SPACE_(CRAYOLA)','#0A7E8C METALLIC_SEAWEED','#4F666A STORMCLOUD',
		'#36747D MING','#ACE5EE BLIZZARD_BLUE','#48929B LIGHT_BLUE_COLOR_(ASAGI-IRO)',
		'#B0E0E6 POWDER_BLUE','#A7D8DE CRYSTAL','#EBF6F7 INDIGO_WHITE_(AIJIRO)',
		'#0E9CA5 BOY_RED','#4BC7CF SEA_SERPENT','#6E7F80 AUROMETALSAURUS',
		'#15F2FD LOTION_BLUE','#A4F4F9 WATERSPROUT','#455859 RUSTY_STORAGE_(SABIONANDO)',
		'#00C5CD TURQUOISE_SURF','#E7FEFF BUBBLES','#7DF9FF ELECTRIC_BLUE',
		'#5F9EA0 CADET_BLUE','#5F8A8B STEEL_TEAL','#F0FFFF AZURE_MIST',
		'#E0FFFF LIGHT_CYAN','#364141 ONANDO_COLOR_(ONANDO-IRO)','#00CED1 DARK_TURQUOISE',
		'#232B2B CHARLESTON_GREEN','#009698 VIRIDIAN_GREEN','#AFEEEE PALE_BLUE_/_PALE_TURQUOISE',
		'#B2FFFF CELESTE','#669999 DESATURATED_CYAN','#203838 GORYEO_STOREROOM_(KORAINANDO)',
		'#2F4F4F DARK_SLATE_GRAY','#30BFBF MAXIMUM_BLUE_GREEN','#004242 WARM_BLACK',
		'#008B8B DARK_CYAN','#00FFFF AQUA','#004040 RICH_BLACK',
		'#007474 SKOBELOFF','#008080 TEAL','#00CCCC ROBIN_EGG_BLUE',
		'#00827F TEAL_GREEN','#004B49 DEEP_JUNGLE_GREEN','#48D1CC MEDIUM_TURQUOISE',
		'#15F4EE FLUORESCENT_BLUE','#0ABAB5 TIFFANY_BLUE','#43B3AE VERDIGRIS',
		'#2B3736 IRON_STORAGE_(TETSUONANDO)','#08E8DE BRIGHT_TURQUOISE','#20B2AA LIGHT_SEA_GREEN',
		'#317873 MYRTLE_GREEN','#5FC9BF BAYSIDE','#354E4B SILK_CREPE_BROWN_(OMESHICHA)',
		'#00FFEF TURQUOISE_BLUE','#2F847C CELADON_GREEN','#40E0D0 TURQUOISE',
		'#01796F PINE_GREEN','#86ABA5 AQUA_BLUE_COLOR_(MIZU-IRO)','#8DD9CC MIDDLE_BLUE_GREEN',
		'#96DED1 PALE_ROBBIN_EGG_BLUE','#00A693 PERSIAN_GREEN','#3AB09E KEPPEL',
		'#4CB7A5 BLUE_LAGOON','#3A6960 BLUE-GREEN_(SEIHEKI)','#6EAEA1 GREEN_SHEEN',
		'#6A7F7A RUSTED_LIGHT-BLUE_(SABIASAGI)','#56887D WINTERGREEN_DREAM','#A8C3BC OPAL',
		'#5DA493 POLISHED_PINE','#18453B MSU_GREEN','#064E40 BLUE-GREEN_(COLOR_WHEEL)',
		'#39A78E ZOMP','#1A2421 DARK_JUNGLE_GREEN','#BBD0C9 JET_STREAM','#49796B HOOKER\'S GREEN',
		'#88D8C0 PEARL_AQUA','#00755E TROPICAL_RAIN_FOREST','#2B3733 IRON_COLOR_(TETSU-IRO)',
		'#007F66 GENERIC VIRIDIAN','#009B7D PAOLO_VERONESE_GREEN','#00FFCD SEA_GREEN_(CRAYOLA)',
		'#319177 ILLUMINATING_EMERALD','#1C352D MEDIUM_JUNGLE_GREEN','#1C352D DEEP AQUAMARINE',
		'#1B4D3E BRUNSWICK_GREEN','#0E7C61 DEEP_GREEN-CYAN_TURQUOISE','#29AB87 JUNGLE_GREEN',
		'#7FFFD4 AQUAMARINE','#44D7A8 EUCALYPTUS','#00563F CASTLETON_GREEN',
		'#30BA8F MOUNTAIN_MEADOW','#006A4E BANGLADESH_GREEN','#00CC99 CARIBBEAN_GREEN',
		'#749F8D PALE_GREEN_ONION_(MIZUASAGI)','#8DA399 MORNING_BLUE','#00DEA4 ASDA_GREEN_(1985)',
		'#007F5C SPANISH_VIRIDIAN','#AAF0D1 MAGIC_MINT','#3EB489 MINT',
		'#F5FFFA MINT_CREAM','#043927 SACRAMENTO_STATE_GREEN','#48BF91 OCEAN_GREEN',
		'#C9FFE5 AERO_BLUE','#00A877 GREEN_(MUNSELL)','#66DDAA MEDIUM_AQUAMARINE',
		'#013220 DARK_GREEN','#E9F6EF ITALIAN_ICE','#1CAC78 GREEN_(CRAYOLA)',
		'#006442 GREEN_BAMBOO_COLOR_(AOTAKE-IRO)','#009F6B GREEN_(NCS)','#9FE2BF SEA_FOAM_GREEN',
		'#009966 GREEN-CYAN','#00A870 SESAME_STREET_GREEN','#35654D POKER_GREEN',
		'#224634 VELVET_(BIRODO)','#123524 PTHALO GREEN','#00A86B JADE',
		'#4D5D53 FELDGRAU','#819C8B CELADON_COLOR','#66C992 ASDA_GREEN_(1999)',
		'#3B7A57 AMAZON','#2D4436 INSECT_SCREEN','#009E60 SHAMROCK_GREEN',
		'#004225 BRITISH_RACING_GREEN','#00FA9A MEDIUM_SPRING_GREEN','#A0D6B4 TURQUOISE_GREEN',
		'#00AB66 GO_GREEN','#A3C1AD CAMBRIDGE_BLUE','#177245 DARK_SPRING_GREEN',
		'#006B3C CADMIUM_GREEN','#80C197 ASDA_GREEN_(1994)','#1AA260 GOOGLE_CHROME_GREEN',
		'#3CB371 MEDIUM_SEA_GREEN','#2E8B57 SEA_GREEN','#99E6B3 TEAL_DEER',
		'#009150 SPANISH_GREEN','#5FA778 SHINY_SHAMROCK','#00703C DARTMOUTH_GREEN',
		'#B2BEB5 ASH_GRAY','#738678 XANADU','#5FA777 FOREST_GREEN_(CRAYOLA)',
		'#014421 FOREST_GREEN_(TRADITIONAL)','#6D9A79 OXLEY','#407A52 PATINA',
		'#253529 BLACK_LEATHER_JACKET','#96C8A2 ETON_BLUE','#008543 PHILIPPINE_GREEN',
		'#738276 SMOKE','#2A603B GREEN_(MIDORI)','#32AD61 ASDA_GREEN_(2002)',
		'#50C878 EMERALD','#3A403B RUSTY_STOREROOM','#828E84 DOLPHIN_GRAY',
		'#00A550 GREEN_(PIGMENT)','#00FF7F GUPPIE_GREEN','#3CD070 UFO_GREEN',
		'#1E4D2B CAL_POLY_POMONA_GREEN','#64E986 VERY_LIGHT_MALACHITE_GREEN','#3D5D42 HORSETAIL_COLOR',
		'#4D8C57 MIDDLE_GREEN','#355E3B DEEP_MOSS_GREEN','#727472 NICKEL',
		'#ACE1AF CELADON','#00AD43 GREEN_(PANTONE)','#F0FFF0 HONEYDEW',
		'#757D75 HARBOR_RAT','#71BC78 IGUANA_GREEN','#2E372E INDIGO_CODIUM_FRAGILE_SEAWEED_BROWN',
		'#059033 NORTH_TEXAS_GREEN','#0BDA51 MALACHITE','#ADDFAD LIGHT_MOSS_GREEN',
		'#8FBC8F DARK_SEA_GREEN','#679267 RUSSIAN_GREEN','#2E963D DOUBAN_GREEN',
		'#465945 GRAY_ASPARAGUS','#90EE90 LIGHT_GREEN','#98FB98 PALE_GREEN',
		'#03C03C DARK_PASTEL_GREEN','#98FF98 MINT_GREEN','#77DD77 PASTEL_GREEN',
		'#306030 MUGHAL_GREEN','#2F7532 JAPANESE_LAUREL','#5CFF67 LEMON_LIME',
		'#00CC33 VIVID_MALACHITE','#A8E4A0 GRANNY_SMITH_APPLE','#66FF66 SCREAMIN\' GREEN',
		'#34B334 AMERICAN_GREEN','#34B233 WAGENINGEN_GREEN','#228B22 FOREST_GREEN',
		'#32CD32 LIME_GREEN','#6B9362 YOUNG_BAMBOO_COLOR','#5A6457 ALOESWOOD_BROWN',
		'#4C9141 MAY_GREEN'
		],
		ratio: [1,1]
	},
	custom: {
		colors: [],
		ratio: [1,1],
		empty: 0
	},
	get all() {
		if (!this.allColors) {
		this.allColors = this.html.concat(this.webSafe).concat(this.flat).concat(this.material).concat(this.custom);
		}
		return this.allColors;
	}
	},
	get palette() {
	return this.collections[this.scheme].colors;
	},
	getCollection: function(scheme) {
	return this.collections[scheme].colors;
	},
	meta: function(key) {
	return this.collections[this.scheme][key];
	}
}
    

export {colors};;