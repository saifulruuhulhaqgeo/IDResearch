package common

import "github.com/spf13/viper"

func InitApplicationConfig(rootPath string) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(rootPath)

	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
}
