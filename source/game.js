var Game = AbstractApplication.extend({
	//inicializa a aplicacao com o stage, um loader e uma screen manager
	init:function(canvasWidth, canvasHeight)
	{
		this._super(canvasWidth, canvasHeight);
	},
	build:function()
	{

		//cria o loader, aqui deve ser carregado todos os assets, a aplicaÃ§Ã£o deve comeÃ§ar na callback
		var assetsToLoader = [
		"john.jpeg"
		];


		this.loader = new PIXI.AssetLoader(assetsToLoader);
		this.initLoad();

		//this.onAssetsLoaded();

		this.stage.setBackgroundColor(0xDEF1EF);


	},
	onAssetsLoaded:function()
	{

		var initScreen = new InitScreen("NIT");
		this.screenManager.addScreen(initScreen);
		this.screenManager.change("NIT");
	}
});