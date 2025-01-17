package tests

import (
	"context"
	"errors"
	"idresearch-web/cmd/webservice"
	"idresearch-web/common"
	"testing"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/sdk/trace"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestNewTracing(t *testing.T) {
	tracer := common.InitTracing()

	_, span := otel.Tracer("unit_test").Start(context.Background(), "uc get all")
	common.TraceError(span, errors.New("unit test"))

	assert.IsType(t, &trace.TracerProvider{}, tracer)

}

func TestInitApp(t *testing.T) {

	common.InitApplicationConfig("../")

	app := fiber.New()
	ws := webservice.RunApp(app)
	assert.IsType(t, &fiber.App{}, ws)
}
